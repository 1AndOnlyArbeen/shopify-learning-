import { data } from "react-router";
import { authenticate } from "../../shopify.server";
import { asyncHandler } from "../../lib/asyncHandler";
import { getProduct } from "../../services/product.server";
import { useLoaderData } from "react-router";
import { Page, Card, Text, Thumbnail } from "@shopify/polaris";

export const loader = asyncHandler(async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const { product, images } = await getProduct(admin, params.id);
  return data({ product, images });
});

// making ui 

export default function ProductDetail() {
  const { product, images } = useLoaderData()

return (
  <Page title={product.title}>
    <Card>
      {images.map((img, index) => (
        <Thumbnail key={index} source={img.url} alt={img.altText} size="large" />
      ))}
      <Text>Status: {product.status}</Text>
      <Text>Description: {product.description}</Text>
      <h3 className=" text-pink-500"> hello </h3>
      
    </Card>
  </Page>
)
}