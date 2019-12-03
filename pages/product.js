import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";

function Product({ product, user }) {
  //console.log(product);
  return (
    <div style={{ paddingBottom: "10em" }}>
      <ProductSummary user={user} {...product} />
      <ProductAttributes user={user} {...product} />
    </div>
  );
}

// We have access to ctx each time we use getInitialProps because of our configuration in _app.js
// below we are destructuring 'query' from ctx, and we are going one level deeper and
// destructuring '_id' from 'query'
Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } };
  const response = await axios.get(url, payload);
  // this will be provided to Products(props)
  // its better to return an object which holds our response, rather than sending the response straight
  return { product: response.data };
};

export default Product;
