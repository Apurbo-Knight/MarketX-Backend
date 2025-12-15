const express = require("express");
const { createNewProduct, getAllProducts, getSingleProduct, deleteProductById, updateProductById } = require("./product.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// create a products (admin)
router.post('/create-product', createNewProduct)

// get all products 
router.get('/', getAllProducts)

// get single product
router.get('/:id', getSingleProduct)

// update product (only admin)
router.patch('/update-product/:id',verifyToken,verifyAdmin, updateProductById)

// delete product by id
router.delete('/delete-product/:id',verifyToken,verifyAdmin, deleteProductById)


module.exports = router;