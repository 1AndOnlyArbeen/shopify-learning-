import { authenticate } from "../shopify.server";
import { redirect } from "react-router";

import { data } from "react-router";
import { asyncHandler } from "../lib/asyncHandler";
import { apiError } from "../lib/apiError";


export const action = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const image = formData.get("image");
  const status = formData.get("status");

  if (!title) {
    throw new apiError(400, " form data is required ");
  }

  try {
    await editProduct(admin, { title, image, status });
  } catch (error) {
    return data({ error: error.message }, { status: 500 });
  }
  return redirect("/app/product");
});

export default function editProductPage(){
 
    return(
        <Page title = "editProduct">
            <ProductEdit/>
        </Page>
    )
}
