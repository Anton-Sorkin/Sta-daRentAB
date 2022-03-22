const { Schema, model } = required("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String },
});

const userModel = model("Users", userSchema);

module.exports = userModel;
