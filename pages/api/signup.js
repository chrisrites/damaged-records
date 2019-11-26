import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import { models } from "mongoose";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1) Validate name / email / password
    if (!isLength(name, { min: 2, max: 30 })) {
      return res.status(422).send("Name must be 2-30 characters long");
    } else if (!isLength(password, { min: 8 })) {
      return res
        .status(422)
        .send("Password must be at least 8 characters long");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid format");
    }
    // 2) Check to see that the user already exists in the db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exists with email ${email}`);
    }
    // 3) --if not, hash their password
    // The parameter 10 is for how many salt rounds you want bcrypt to perform for added security
    const hash = await bcrypt.hash(password, 10);
    // 4) create user
    const newUser = await new User({
      name,
      email,
      password: hash
    }).save();
    console.log({ newUser });
    // 5) create a cart for the new user
    await new Cart({ user: newUser._id }).save();
    // 6) create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      // 7d for seven days
      expiresIn: "7d"
    });
    // 7) send back the token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user.  Please try again later");
  }
};
