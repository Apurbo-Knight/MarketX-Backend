const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  bio: { type: String, maxLength: 200 },
  profession: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// hash password
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

// compare password
userSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

const user = mongoose.model("User", userSchema);

module.exports = user;
