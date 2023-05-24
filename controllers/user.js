const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const cloud = require("../middleware/cloudinary");

//signup function
exports.signup = async (req, res) => {
  let errorServer = null;
  let file = null;
  /* const obj = {
    data: req.file ? req.file.originalname.split(" ").join("_") : null,
    contentType: "image/*",
  };*/

  if (req.file) {
    const cloudinary = cloud.v2.uploader.upload(req.file.path);
    file = (await cloudinary).secure_url;
  }

  await bcrypt.hash(req.body.password, 10).then((hash) => {
    const admin = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      imgUrl: file,
      isAdmin: req.body.isAdmin === "true",
      date: new Date().toUTCString(),
    });
    admin
      .save()
      .then(() => {
        res.status(201).json({
          message: "Un nouvel utilisateur a été crée dans la base de donnée",
        });
      })
      .catch((error) => {
        errorServer = error;
        res.status(400).json(errorServer);
      });
  });
};

//login function
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Cet utilisateur est introuvable dans la base de donnée",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = jwt
      .sign({ id: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "3d" })
      .split("-")
      .join("_");

    res.cookie("jwt", token, { httpOnly: true, maxAge: 259200000 });
    res.status(200).json({ userId: user._id, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//get user function
exports.getUser = async (req, res) => {
  try {
    await User.find()
      .sort({ $natural: -1 })
      .select("-password")
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(error));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//getOne user function
exports.getOneUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await User.findById({ _id: req.params.id })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(400).json(`ID unknow : ${error}`));
  }
};

//UpdateOne user function
exports.modifyUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    let obj = {};

    if (req.file) {
      const cloudinary = await cloud.v2.uploader.upload(req.file.path);
      const file = cloudinary.secure_url;
      obj = {
        ...obj,
        imgUrl: file,
      };
    }
    if (req.body.password) {
      obj = {
        ...obj,
        password: await bcrypt.hash(req.body.password, 10),
      };
    }
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          ...obj,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((user) => console.log(user))
      .then(() =>
        res
          .status(200)
          .json({ message: "Les informations ont bien étées mise à jour" })
      )
      .catch((error) => res.status(401).json({ error }));
  }
};

//deleteOne User function
exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    await User.deleteOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
      })
      .then(() =>
        res.status(200).json({ message: "Votre compte a bien été supprimé" })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};

//logout function
exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

//function getOrderByUser
exports.getOrderByUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    User.findById({ _id: req.params.id })
      .populate({
        path: "orders",
        options: {
          sort: { $natural: -1 },
        },
      })
      .then((order) => res.status(200).json(order))
      .catch((error) => res.status(400).json(`ID unknow : ${error}`));
  }
};
