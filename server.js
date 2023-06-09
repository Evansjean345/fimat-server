const express = require("express");
const app = express();
const port = 4000;
require("dotenv").config({ path: "./config/.env" });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const mongoose = require("mongoose");
const path = require('path')
const UserRoutes = require("./routes/user");
const OrderRoutes = require("./routes/order");
const { checkUser, requireAuth } = require("./middleware/auth");

app.get("/", (req, res) => res.sendFile(__dirname + `/pages/index.html`));

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//connect to database
//not change the Username

mongoose
  .connect(
    "mongodb+srv://evansJean:Azerty0987@cluster0.a2k1t6d.mongodb.net/fimat?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => console.log(`database connecting ${res}`))
  .catch((err) => console.log(`connection failed ${err.message}`));

app.use("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id);
});
app.use(UserRoutes);
app.use(OrderRoutes);
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
