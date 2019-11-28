import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";

connectDb();

// This will help us convert a string into an object
const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handlePutRequest(req, res) {
  const { quantity, productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // Get user cart based on userId
    const cart = await Cart.findOne({ user: userId });
    // Check if product already exists in cart
    // .some is a mongoose method like 'every', but instead of searching every item,
    // it will stop when it finds one
    // .some expects an argument so we're just naming it doc which stands for our db document
    // ObjectId is a mongoose Types which allows us to convert a string to an object
    // so we can compare it against doc.product
    const productExists = cart.products.some(doc =>
      ObjectId(productId).equals(doc.product)
    );
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        // $inc for increment our quantity
        // the $ is known as the positional operatory.  It represent and index of the element
        // we want to update as specified by "products.product": productId above
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        // addToSet is similiar to push.  But in our case we want to add only if our product
        // is unique, the first of its kind in the cart
        { $addToSet: { products: newProduct } }
      );
    }
    res.status(200).send("Cart updated");
    // if so, increment quantity by number provided to request
    // if not, add new product with given quantity
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handleDeleteRequest(req, res) {
  // here we are destructing params from the query string, as we specified in params
  // of our payload in the cart page
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      // We want the updated, new version of the cart
      { new: true }
      // re-populate so we don't just get an array back of product ids
    ).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}
