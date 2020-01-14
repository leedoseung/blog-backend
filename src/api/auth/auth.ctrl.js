import Joi from 'joi';
import User from '../../models/user';

/* 
POST /api/auth/register
{
    username: 'duvis',
    password: 'duvis123!'
}
*/
export const register = async ctx => {
  const scheme = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, scheme);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exist = await User.findByUsername(username);
    if (exist) {
      ctx.status = 409; //Conflict
      return;
    }

    const user = new User({
      username,
    });

    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
POST /api/auth/login
{
    username: 'duvis',
    password: 'duvis123!'
}
*/
export const login = async ctx => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401; // Unauthorized
      return;
    }

    const vaild = await user.checkPassword(password);
    if (!vaild) {
      ctx.status = 401; // Unauthorized
      return;
    }

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const check = async ctx => {};
export const logout = async ctx => {};
