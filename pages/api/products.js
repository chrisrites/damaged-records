//import products from "../../static/products.json";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  const { page, size } = req.query;
  // Convert the query string values to numbers
  const pageNum = Number(page);
  const pageSize = Number(size);
  let products = [];
  const totalDocs = await Product.countDocuments();
  // Round up total number of pages.  Even if there's only like 2 products, we still need a page to display them
  const totalPages = Math.ceil(totalDocs / pageSize);
  if (pageNum === 1) {
    products = await Product.find().limit(pageSize);
  } else {
    // If not on first page, determine how many products to skip in order to
    // display the correct products on whatever page you may be on
    const skips = pageSize * (pageNum - 1);
    products = await Product.find()
      .skip(skips)
      .limit(pageSize);
  }
  //const products = await Product.find();
  res.status(200).json({ products, totalPages });
};
