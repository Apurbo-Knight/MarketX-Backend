const Reviews = require("../reviews/review.model");
const { errorResponse, successResponse } = require("../utils/responseHandeler");
const Products = require("./product.model");
const User = require("../users/user.model");

// creact new product (admin)
const createNewProduct = async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });

    const saveProduct = await newProduct.save();

    //calculate average rating
    const reviews = await Reviews.find({ productId: saveProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      saveProduct.rating = averageRating;
    }
    return successResponse(
      res,
      200,
      "Product created successfully",
      saveProduct
    );
  } catch (error) {
    errorResponse(res, 500, "Faield to create a new product", error);
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const {category,color,minPrice,maxPrice,page = 1,limit = 10} = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (color && color !== "all") {
      filter.color = color;
    }
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    // console.log(skip, totalPages, totalProducts)

    const products = await Products.find(filter)  /* find er vitore sob somoy object pathaite hoy */
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email username");
    return successResponse(res,200,"Products fetched sucessfully",({products,totalPages,totalProducts,})
    );
  } catch (error) {
    return errorResponse(res, 500, "Failed get all pruducts", error);
  }
};

// Get Single Product
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id).populate(
      "author",
      "username email"
    );
    if (!product) {
      errorResponse(res, 500, "Failed to get single product");
    }
    const reviews = await Reviews.find({ productId: id }).populate(
      "userId",
      "username email"
    );

    return successResponse(res, 200, "Single product and reviews", {
      product,
      reviews,
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to get single product", error);
  }
};

// update product (only admin)
const updateProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return errorResponse(res, 500, "Product not found", error);
    }
    return successResponse(res,200,"product updated successfull",
      updatedProduct);
  } catch (error) {
    errorResponse(res, 500, "Failed to update", error);
  }
};

// Delete Product By Id
const deleteProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProducts = await Products.findByIdAndDelete(productId);
    if (!deletedProducts) {
      return errorResponse(res, 404, "Product not found");
    }
    await Reviews.deleteMany({
      productId: productId,
    }); /*the key ProductId has to be same as Review model schema ProductId */
    return successResponse(
      res,
      200,
      "Product deleted successfully",
      deletedProducts
    );
  } catch (error) {
    errorResponse(res, 500, "failed to delete product", error);
  }
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getSingleProduct,
  updateProductById,
  deleteProductById,
};
