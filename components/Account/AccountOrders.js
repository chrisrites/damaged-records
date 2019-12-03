import {
  Header,
  Accordion,
  Label,
  Segment,
  Icon,
  Button,
  List,
  Image
} from "semantic-ui-react";
import { useRouter } from "next/router";
import formatDate from "../../utils/formatDate";

function AccountOrders({ orders }) {
  const router = useRouter();

  function mapOrdersToPanels(orders) {
    return orders.map(order => ({
      key: order._id,
      title: {
        content: <Label color="blue" content={formatDate(order.createdAt)} />
      },
      content: {
        content: (
          <>
            <List.Header as="h3">
              Total: ${order.total}
              <Label
                content={order.email}
                icon="mail"
                basic
                horizontal
                style={{ marginLeft: "1em" }}
              />
              <List>
                {order.products.map(p => (
                  <List.Item>
                    <Image avatar src={p.product.mediaUrl} />
                    <List.Content>
                      <List.Header>{p.product.name}</List.Header>
                      <List.Description>
                        {p.quantity} x ${p.product.price}
                      </List.Description>
                      <List.Content floated="right">
                        <Label tag color="red" size="tiny">
                          {p.product.sku}
                        </Label>
                      </List.Content>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </List.Header>
          </>
        )
      }
    }));
  }

  return (
    <>
      <Header as="h2" inverted>
        <Icon name="folder open" inverted />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            No past orders.
          </Header>
          <div>
            <Button onClick={() => router.push("/")} color="orange">
              View Products
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          fluid
          styled
          // you exclusive mean you can have multiple order panels open at the same time in our accordion
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      )}
    </>
  );
}

export default AccountOrders;
