import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // Get all users except the current, root user
    const users = await User.find({ _id: { $ne: userId } }).sort({
      role: "asc"
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};
