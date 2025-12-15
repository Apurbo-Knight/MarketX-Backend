const { default: mongoose, Types } = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const reviews = mongoose.model("Review", reviewSchema);

module.exports = reviews;
