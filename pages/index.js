import React from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";

function Home({ products }) {
  return <ProductList products={products} />;
}

// getInitialProps is a NEXT function which allows us to fetch our data first
// without waiting for the component to mount.
// to execute it, use the component name like so
Home.getInitialProps = async () => {
  // fetch data on the server
  const url = `${baseUrl}/api/products`;
  // can put the response data in a variable of the same name
  const response = await axios.get(url);
  // name the response in order to create a new object from the response
  return { products: response.data };
  // return the response data as on object
  // note: this object will be merged with existing props, will not overwrite them
};

export default Home;
