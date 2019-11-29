import React from "react";
import axios from "axios";
import { Header, Checkbox, Table, Icon } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import formatDate from "../../utils/formatDate";

function AccountPermissions() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    // We're doing our fetch from a function component as opposed to from a page
    // component or our backend, because we don't always want to do this fetch on the
    // account client.  Only when user has root permissions
    const url = `${baseUrl}/api/users`;
    const token = cookie.get("token");
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setUsers(response.data);
  }

  return (
    <div style={{ margin: "2em 0" }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user => (
            // We're going to create the UserPermission component in this file down at the bottom
            <UserPermission key={user._id} user={user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ user }) {
  const [admin, setAdmin] = React.useState(user.role === "admin");
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    // in order to avoid setting role updated when the component mounts, we want to
    // skip the first time it is triggered.  We can achieve this using the above useRef line and returning
    // on first run through
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    updatePermission();
  }, [admin]);

  function handleChangePermission() {
    // Updater pattern
    setAdmin(prevState => !prevState);
  }

  async function updatePermission() {
    const url = `${baseUrl}/api/account`;
    const payload = { _id: user._id, role: admin ? "admin" : "user" };
    await axios.put(url, payload);
  }

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={admin} toggle onChange={handleChangePermission} />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? "admin" : "user"}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
