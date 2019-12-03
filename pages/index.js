import React from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";
import baseUrl from "../utils/baseUrl";

function Home({ products, totalPages }) {
  return (
    <div style={{ paddingBottom: "13em" }}>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </div>
  );
}

// getInitialProps is a NEXT function which allows us to fetch our data first
// without waiting for the component to mount.
// to execute it, use the component name like so
Home.getInitialProps = async ctx => {
  // for pagination, get the query string from the browers url or start it at 1
  const page = ctx.query.page ? ctx.query.page : 1;
  // display 9 products per page
  const size = 9;
  // fetch data on the server
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page, size } };
  // can put the response data in a variable of the same name
  const response = await axios.get(url, payload);
  // name the response in order to create a new object from the response
  return response.data;
  // return the response data as on object
  // note: this object will be merged with existing props, will not overwrite them
};

export default Home;
