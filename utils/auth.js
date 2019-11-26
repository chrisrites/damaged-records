import cookie from "js-cookie";
// Since we're in a function, not a function component, we can import the
// Router directly, as opposed to the useRouter hook
import Router from "next/router";

export function handleLogin(token) {
  // 'token' is for the cookies name
  cookie.set("token", token);
  Router.push("/account");
}

export function redirectUser(ctx, location) {
  if (ctx.req) {
    // This is a way to redirect with node.  302 stands for url redirect
    ctx.res.writeHead(302, { Location: location });
    // to stop writing to this response
    ctx.res.end();
  } else {
    // Otherwise, redirect on the client if we are on the client
    Router.push(location);
  }
}
