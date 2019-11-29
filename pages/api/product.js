import Product from "../../models/Product";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  // use 'req.method' to determine which type of request we're handling: GET, DELETE etc
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      // Error in how the request was made
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  // ES6 syntax.  _id name and _id value have the same name so you can reduce to _id
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}

async function handlePostRequest(req, res) {
  const { name, price, description, mediaUrl } = req.body;
  try {
    if (!name || !price || !description || !mediaUrl) {
      //  422 when use hasn't provided necessary information
      return res.status(422).send("Product missing one or more fields");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl
      //  .save() will save to the db
    }).save();
    //  201 resource created
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error in creating product");
  }
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  try {
    // 1) Delete product by id
    await Product.findOneAndDelete({ _id });
    // 2) Remove product from all carts, referenced as 'product'.  This is a cascade delete
    // as opposed to an atomic delete.  A cascade delete deletes from multiple documents
    await Cart.updateMany(
      { "products.product": _id },
      // Pull from the products array (Products in all carts), the product that matches our _id
      { $pull: { products: { product: _id } } }
    );
    // 204: No content.  Delete was successful, but no content to send back
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
}
