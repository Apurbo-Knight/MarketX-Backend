const { default: mongoose, Types } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: false },
    image: { type: String, required: true },
    color: String,
    rating: { type: Number, default: 0 },
    author: {        /*  */
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const products = mongoose.model("Product", productSchema);

module.exports = products;
