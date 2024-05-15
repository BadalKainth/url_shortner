const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 6969;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("mongoDB connected!")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/", staticRoute);
app.use("/url", restrictTo(["Normal", "Admin"]), urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at PORT:${PORT} `));
