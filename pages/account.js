import AccountHeader from "../components/Account/AccountHeader";
import AccountOrders from "../components/Account/AccountOrders";
import AccountPermissions from "../components/Account/AccountPermissions";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Account({ user, orders }) {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {/* // If user.role='root', display AccountPermissions component */}
      {user.role === "root" && <AccountPermissions currentUserId={user._id} />}
    </>
  );
}

Account.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  // Check to see if we have a valid token, even though we've already made account a protected route
  // , we'll check just in case
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;
};

export default Account;
