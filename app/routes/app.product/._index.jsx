import { data } from "react-router";
import { authenticate } from "../../shopify.server";
import { asyncHandler } from "../../lib/asyncHandler";
import { getProducts } from "../../services/product.server";
import { useLoaderData } from "react-router";
import { Page } from "@shopify/polaris";
import ProductTable from "../../components/ProductTable";

export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  const { products,pageInfo } = await getProducts(admin,request);
  return data({ products, pageInfo });
});






export default function ProductListPage() {
  const { products, pageInfo } = useLoaderData();

  return (
    <Page title="Products">
      <ProductTable products={products} pageInfo={pageInfo} />
    </Page>
  );
}
