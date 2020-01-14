import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserScheme = new Schema({
  username: String,
  hashedPassword: String,
});

UserScheme.methods.setPassword = async function(password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserScheme.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserScheme.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserScheme.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', UserScheme);
export default User;
