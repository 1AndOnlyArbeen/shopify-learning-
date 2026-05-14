import { authenticate } from "../shopify.server";
import { redirect } from "react-router";

import { data } from "react-router";
import { asyncHandler } from "../lib/asyncHandler";
import { apiError } from "../lib/apiError";
import { createProduct } from "../services/product.server";

import { Page } from "@shopify/polaris";
import ProductCreate from "../components/ProductCreate"


export const action = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const title = formData.get("ProductName");
  const image = formData.get("image");
  const status = formData.get("status") || " ACTIVE ";

  if (!title) {
    throw new apiError(400, " Product name is required ");
  }

  try {
    await createProduct(admin, { title, image, status });
  } catch (error) {
    return data({ error: error.message }, { status: 500 });
  }

  return redirect("/app/product");
});




export default function CreateProductPage() {

  return (
    <Page title="Products">
      <ProductCreate/>
      
    </Page>
  );
}


