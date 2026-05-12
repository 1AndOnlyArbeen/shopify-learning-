import { apiError } from "../lib/apiError";

export async function getProducts(admin,request) {

const url = new URL(request.url)
const cursor = url.searchParams.get("cursor") || null
const direction = url.searchParams.get("direction") || "next"

const variables = direction === "prev"
  ? { last: 10, before: cursor }
  : { first: 10, after: cursor }

  const response = await admin.graphql(`
    query GetProducts ($first: Int, $last: Int, $after: String, $before: String) {
      products(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            title
            status
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  `,
    { variables },
  );

  const result = await response.json();
  console.log(result)

  if (!result) {
    throw new apiError(404, "Product data not found");
  }

  const products = result.data.products.edges.map((e) => ({
    ...e.node,
    image: e.node.images.edges[0]?.node?.url || "",
  }));

  const pageInfo = result.data.products.pageInfo;
  console.log(products)
  console.log(pageInfo)

  return { products, pageInfo };
}

export async function getProduct(admin, id) {
  const gid = `gid://shopify/Product/${id}`;

  const response = await admin.graphql(
    `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        description
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  `,
    { variables: { id: gid } },
  );

  const result = await response.json();

  if (!result) {
    throw new apiError(404, "No product data found");
  }

  const product = result.data.product;
  const images = product.images.edges.map((e) => e.node);

  return { product, images };
}
