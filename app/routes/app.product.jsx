import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { apiError } from "../lib/apiError";
import { asyncHandler } from "../lib/asyncHandler";

import { useLoaderData, useNavigate } from "react-router";
import {
  Page,
  Card,
  DataTable,
  Thumbnail,
  Badge,
  Button,
  Pagination,
  BlockStack,
  Text,
} from "@shopify/polaris";

// get the product data form the shopify

export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  //graph

  const response = await admin.graphql(
    `
    query GetProduct {
    products(first: 10){
    edges {
    node{
    id 
    title
    status
    images(first:1){
    edges{
    node{
    url
    altText}}
    }
}} pageInfo{
 hasNextPage
 endCursor }
    }
    }
    `,
  );

  // give the json

  const result = await response.json();

  if (!result) {
    throw new apiError(404, " Product data not found ");
  }
  //  making it into format
  const products = result.data.products.edges.map((e) => ({
    ...e.node,
       image: e.node.images.edges[0]?.node?.url || "" }));

  const pageInfo = result.data.products.pageInfo;
  console.log(products);

  return data({ products, pageInfo });
});

// frontend

// making ui

export default function () {
  const { products,pageInfo } = useLoaderData();
  console.log(products);

  const navigate = useNavigate();

  const list = products.map((p) => [
    p.id,
    p.title,
    p.status,
    p.image
  ]);

  return (
  
   <Page
      title="Products"
      primaryAction={{ content: "Edit", onAction: () => {} }}
    >
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Image", "Title", "Status", "Action"]}
          rows={products.map((p) => [
            <Thumbnail source={p.image} alt={p.title} size="small" />,
            p.title,
            <Badge>{p.status}</Badge>,
            <Button onClick={()=>navigate('/app/product/hj')} variant="plain">View</Button>,
          ])}
        />
      </Card>
      <Pagination
        hasNext={pageInfo.hasNextPage}
        onNext={() => navigate(`?cursor=${pageInfo.endCursor}`)}
      />
    </Page>
  
)
}
