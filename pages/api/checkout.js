import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;

  try {
    // 1) Verify and get userid from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // 2) Find cart based on user id, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    // 3) Calculate cart totals from cart products again, to make sure its correct and has not been changed
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // 4) Get the email from payment data and see if email is linked with existing stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      // We just want one customer returned to us
      limit: 1
    });
    const isExistingCustomer = prevCustomer.data.length > 0;
    // 5) If not existing customer, create them baesd on their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      });
    }
    // if existing customer, save existing customers is, otherise save newCustomer's id
    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    // 6) Create the charge with total, send receipt via email
    await stripe.charges.create(
      {
        currency: "CAD",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`
      },
      {
        // Make sure that a charge isn't executed twice.  Associate each charge with a unique string
        idempotency_key: uuidv4()
      }
    );
    // 7) Add order to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save();
    // 8) Clear products in cart
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      // set the array to whatever value we like.  In this case clear previous products from cart
      { $set: { products: [] } }
    );
    // 9) Send back success/200 response
    res.status(200).send("Checkout successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge");
  }
};
