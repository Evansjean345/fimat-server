const Order = require("../models/order");
const User = require("../models/user");
const ObjectID = require("mongoose").Types.ObjectId;
const cloud = require("../middleware/cloudinary");

//createOrder function
exports.createOrder = async (req, res) => {
  let file = null;
  if (req.file) {
    const cloudinary = cloud.v2.uploader.upload(req.file.path);
    file = (await cloudinary).secure_url;
  }
  const userId = req.body.userId;
  const order = new Order({
    ...req.body,
    orderUrl: file,
    tracking: `CHAP${Math.random() * (10 - 1) + 1}`,
    date: new Date().toUTCString(),
  });
  order
    .save()
    .then(() => {
      return User.findByIdAndUpdate(
        { _id: order.user },
        { $push: { orders: order._id } }
      );
    })
    .then(() =>
      res.status(201).json({ message: "La commande a bien étée enregistrée" })
    )
    .catch((error) => res.status(400).json({ error }));
};

//getOrder Function
exports.getOrder = async (req, res) => {
  try {
    await Order.find()
      .populate({ path: "user" })
      .sort({ $natural: -1 })
      .then((order) => res.status(200).json(order))
      .catch((error) => res.status(400).json(error));
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//getOneOrder Function
exports.getOneOrder = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    try {
      await Order.findById({ _id: req.params.id })
        .populate({ path: "user" })
        .then((order) => res.status(200).json(order))
        .catch((error) => res.status(400).json(`ID unknown : ${error}`));
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};

//UpdateOneOrder Function
exports.modifyOrder = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    try {
      let obj = {};
      if (req.file) {
        const cloudinary = cloud.v2.uploader.upload(req.file.path);
        const file = (await cloudinary).secure_url;
        obj = {
          ...obj,
          orderUrl: file,
        };
      }
      await Order.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
            ...obj,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
        .then((order) => console.log(order))
        .then(() =>
          res.status(200).json({
            message:
              "Les informations de la commande ont bien étée mise à jour",
          })
        )
        .catch((error) => res.status(401).json({ error }));
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
};

//deleteOneOrder Function
exports.deleteOrder = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  } else {
    try {
      await Order.deleteOne({ _id: req.params.id })
        .then((order) => {
          console.log(order);
        })
        .then(() =>
          res.status(200).json({ message: "La commande a bien été annulée" })
        )
        .catch((error) => res.status(400).json({ error }));
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
};
