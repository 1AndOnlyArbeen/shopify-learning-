import { apiError } from "../lib/apiError";

export async function getProducts(admin, request) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") || null;
  const direction = url.searchParams.get("direction") || "next";

  const variables =
    direction === "prev"
      ? { last: 10, before: cursor }
      : { first: 10, after: cursor };

  const response = await admin.graphql(
    `
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
  console.log(result);

  const products = result.data.products.edges.map((e) => ({
    ...e.node,
    image: e.node.images.edges[0]?.node?.url || "",
  }));

  const pageInfo = result.data.products.pageInfo;
  console.log(products);
  console.log(pageInfo);

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
   if (!product) {
    throw new apiError(404, " Product not found ");
  }
  const images = product.images.edges.map((e) => e.node);
 
  if (!images) {
    throw new apiError(404, " Image not found ");
  }
  return { product, images };
}





// edit existing product 












// create product

export async function createProduct(admin, { title, status, image }) {
  const response = await admin.graphql(
    `
    mutation ProductCreate ($product : ProductCreateInput !){
    productCreate(product: $product){
    product{id title status}
    userErrors { field message }
    
    }
    }
    `,
    {
      variables: {
        product: { title, status },
      },
    },
  );

    const result = await response.json();
  if(result.errors){
    throw new apiError(500,result.errors.map((e)=> e.message).join(",") )
  }
const errorsHandeling = result?.data?.productCreate?.userErrors??[];

if(errorsHandeling.length >0){
  throw new apiError (400, errorsHandeling.map((e)=>e.message).join(", "))



}
const product = result.data.productCreate.product
if (!product) {
  throw new apiError(400, "Product not found ")
  
}

  if (image && image.size > 0) {


    // STEP 1 — ask Shopify for upload URL
    const stagedResponse = await admin.graphql(`
    mutation {
      stagedUploadsCreate(input: {
        filename: "${image.name}",
        mimeType: "${image.type}",
        fileSize: "${image.size}",
        httpMethod: POST,
        resource: IMAGE
      }) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
      }
    }
  `);

    const stagedJson = await stagedResponse.json();
    const target = stagedJson.data.stagedUploadsCreate.stagedTargets[0];

    // STEP 2 — upload image to that URL
    const uploadForm = new FormData();
    target.parameters.forEach(({ name, value }) => {
      uploadForm.append(name, value);
    });
    uploadForm.append("file", image);
    await fetch(target.url, { method: "POST", body: uploadForm });

    // STEP 3 — attach image to product
    await admin.graphql(`
    mutation {
      productCreateMedia(
        productId: "${product.id}",
        media: [{
          originalSource: "${target.resourceUrl}",
          mediaContentType: IMAGE
        }]
      ) {
        media {
          ... on MediaImage {
            image { url }
          }
        }
        userErrors { field message }
      }
    }
  `);
};
return product
}
