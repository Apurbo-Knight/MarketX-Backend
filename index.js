require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://market-x-frontend.vercel.app/'],
  credentials: true
}))

const UploadImage = require("./src/utils/UploadImage")

// routes
const userRoutes = require('./src/users/user.route')
const productsRoutes = require('./src/products/product.route')
const reviewRouters = require('./src/reviews/review.route')
const orderRoutes = require('./src/order/order.route')
const statsRoutes = require('./src/stats/stats.route')

app.use('/api/auth', userRoutes)
app.use('/api/products',productsRoutes)
app.use('/api/reviews', reviewRouters)
app.use('/api/orders', orderRoutes)
app.use('/api/stats',statsRoutes)

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.get("/", (req, res) => {
  res.send("Hello World!"); 
});
}

main()
  .then(() => console.log("mongoDB connected successfully"))
  .catch((err) => console.log(err));


// upload image api
app.post('/uploadImage',  (req, res) => {
  UploadImage(req.body.image)
  .then((url) => res.send(url))
  .catch((error) => res.status(500).send(error));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
