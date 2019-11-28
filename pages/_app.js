import App from "next/app";
import Layout from "../components/_App/Layout";
// Next Cookies
import { parseCookies, destroyCookie } from "nookies";
import { redirectUser } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import Router from "next/router";

class MyApp extends App {
  // This getInitialProps function is a NEXT feature.  Each component that relies on it will invoke it from
  // their page
  // static methods can be accessed outside of classes
  static async getInitialProps({ Component, ctx }) {
    // This is how we can use Next and it's cookies functionality to verify our user
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const isProtectedRoute =
        ctx.pathname === "/account" || ctx.pathname === "/create";
      if (isProtectedRoute) {
        redirectUser(ctx, "/login");
      }
    } else {
      try {
        // When we have a token and we want to get a user, we can provide a header
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;
        const isRoot = user.role === "root";
        const isAdmin = user.role === "admin";
        // if authenticated but not of role admin or root, we want to redirect from the '/create' page
        const isNotPermitted =
          !(isRoot || isAdmin) && ctx.pathname === "/create";
        if (isNotPermitted) {
          redirectUser(ctx, "/");
        }
        // pass our user to our pageProps so our whole app has user
        pageProps.user = user;
      } catch (error) {
        console.error("Error getting current user");
        // 1) Throw out invalid token
        // destroy cookie receive the ctx as well as the name of the token as a string
        destroyCookie(ctx, "token");
        // 2) Redirect to login page
        redirectUser(ctx, "/login");
      }
    }

    // ES6 syntax. 'pageProps; is the same as 'pageProps: pageProps;
    return { pageProps };
  }

  componentDidMount() {
    // detect when local storage changes so we know when a user has signed out in any browser window.
    // See /utils/auth
    window.addEventListener("storage", this.syncLogout);
  }

  syncLogout = event => {
    // 'logout' is the value we provided to local storage in the handleLogout function in the utils/auth file
    if (event.key === "logout") {
      // console.log("logged out from storage");
      Router.push("/login");
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
