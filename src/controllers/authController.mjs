import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../models/index.mjs";
import appConfing from "../config/app.confing.mjs";

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password, appConfing.salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (roles) {
      const userRoles = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      });
      await user.setRoles(userRoles);
      res.send({
        message: "User was registered!:)",
      });
    } else {
      await user.setRoles([1]);
      res.send({
        message: "User was registered!:)",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: user.id }, appConfing.secret, {
      expiresIn: 86400,
    });

    const roles = await user.getRoles();
    const authorities = roles.map((role) => `ROLE_${role.name.toUpperCase()}`);
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {signup, signin}

