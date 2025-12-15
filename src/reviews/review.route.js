const express =  require('express');
const { postAReview, getUsersReview, getTotalReviews } = require('./review.controller');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// post a review
router.post('/post-review',verifyToken, postAReview)

// get review count
router.get('/total-reviews', getTotalReviews)

// get review data for user
router.get('/:userId', getUsersReview)



module.exports = router