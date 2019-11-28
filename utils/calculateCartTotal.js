function calculateCartTotal(products) {
  // reduce array method gives us access to the accumulator 'acc', and the element (each element in the array)
  const total = products.reduce((acc, el) => {
    acc += el.product.price * el.quantity;
    // each return acc return to the next iteration of the array
    return acc;
    // 0 stands for our starting total
  }, 0);
  // multiplying by 100 and then dividing by 100 fixing rounding errors common to
  // javascript which occur when multiplying numbers by decimal numbers.
  // In our case quantity times the price
  const cartTotal = ((total * 100) / 100).toFixed(2);
  // toFixed returns a string.  Stripe or other payment apis need a number, so we convert it
  const stripeTotal = Number((total * 100).toFixed(2));

  return { cartTotal, stripeTotal };
}

export default calculateCartTotal;
