import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { asyncHandler } from "../lib/asyncHandler";
import { getProducts } from "../services/product.server";
import { useLoaderData, useNavigate } from "react-router";
import { Page } from "@shopify/polaris";
import ProductTable from "../components/ProductTable.jsx";


export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const { products,pageInfo } = await getProducts(admin,request);
  return data({ products, pageInfo });
});




export default function ProductListPage() {
  const { products, pageInfo } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page title="Products"
     primaryAction={{ content: "Create Product", onAction: () => navigate("/app/product/create") }}
    >
      
      <ProductTable products={products} pageInfo={pageInfo} />

    </Page>
  );
}
