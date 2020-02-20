import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

UserScheme.methods.generateToken = function() {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토근 안에 집어넣고 싶은 데이터를 넣는다.
    {
      _id: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣는다.
    {
      expiresIn: '7d', //7일 동안 유효함
    },
  );
  return token;
};

const User = mongoose.model('User', UserScheme);
export default User;
