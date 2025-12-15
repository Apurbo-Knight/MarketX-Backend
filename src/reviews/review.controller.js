const Products = require("../products/product.model");
const { errorResponse, successResponse } = require("../utils/responseHandeler");

const Reviews = require("./review.model");

// post a review
const postAReview = async (req, res) => {
  try {
    const { comment, rating, userId, productId } = req.body;
    if (!comment || rating === undefined || !productId || !userId) {
      return errorResponse(res, 400, "missing require field");
    }

    const existingReview = await Reviews.findOne({ productId, userId });
    console.log(existingReview);

    if (existingReview) {
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Reviews({
        comment,
        rating,
        userId,
        productId,
      });

      await newReview.save();
    }

    const reviews = await Reviews.find({ productId, userId });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;

      const product = await Products.findById(productId);

      if (product) {
        product.rating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else {
        return errorResponse(res, 500, "Product not found", error);
      }
    }

    return successResponse(res, 200, "review send", reviews);
  } catch (error) {
    return errorResponse(res, 500, "Failed to post a review", error);
  }
};

// get Users Review
const getUsersReview = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return errorResponse(res, 400, "Missing Userid");
    }

    const reviews = await Reviews.find({userId}).sort({createdAt:-1})

    if (reviews.length === 0) {
      return successResponse(res, 404, "No reviews found for this user");
    }

    return successResponse(res, 200, "Review fetch Successfully", reviews);
  } catch (error) {
    return errorResponse(res, 500, "Faield to get user review", error);
  }
};

const getTotalReviews = async(req,res) =>{
  try {
    const totalReviews = await Reviews.countDocuments({})
    return successResponse(res,200,"Total reviews count fetch successfully",totalReviews)
  } catch (error) {
    errorResponse(res,500,"Failed to get user count", error)
  }
}

module.exports = {
  postAReview,
  getUsersReview,
  getTotalReviews
};
