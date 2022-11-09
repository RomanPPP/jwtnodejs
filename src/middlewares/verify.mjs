import db from "../models/index.mjs";
import roles from "../config/roles.mjs";
const User = db.user;

const checkDuplicateUsername = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    res.status(400).send({
      message: "Failed! Username is already in use!",
    });
    return;
  }
  next();
};

const checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    res.status(400).send({
      message: "Failed! Email is already in use!",
    });
    return;
  }
  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!roles.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

export  { checkDuplicateUsername, checkDuplicateEmail, checkRolesExisted };
