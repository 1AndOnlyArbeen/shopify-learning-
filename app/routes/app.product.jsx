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
  const products = result.data.products.edges.map((e) => e.node);
  const pageInfo = result.data.products.pageInfo;
  console.log(products);

  return data({ products, pageInfo });
});
