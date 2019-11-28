import { useRouter } from "next/router";
import { Container, Pagination } from "semantic-ui-react";

function ProductPagination({ totalPages }) {
  const router = useRouter();

  return (
    <Container textAlign="center" style={{ margin: "2em" }}>
      <Pagination
        defaultActivePage={1}
        totalPages={totalPages}
        // event and data are arguments semanticUI's pagination component uses to navigate between
        // lists of product pages
        onPageChange={(event, data) => {
          data.activePage === 1
            ? router.push("/")
            : // set the query string in the browser url window and route to the active page
              router.push(`/?page=${data.activePage}`);
        }}
      />
    </Container>
  );
}

export default ProductPagination;
