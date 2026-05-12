import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { asyncHandler } from "../lib/asyncHandler";
import { getProducts } from "../services/product.server";

import { useLoaderData, useNavigate } from "react-router";
import {
  Page,
  Card,
  DataTable,
  Thumbnail,
  Badge,
  Button,
  Pagination,
} from "@shopify/polaris";

export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { products, pageInfo } = await getProducts(admin);
  return data({ products, pageInfo });
});

// frontend

// making ui

export default function ProductListPage() {
  const { products,pageInfo } = useLoaderData();
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
           <Button variant="plain" onClick={() => navigate(`/app/product/${p.id.split("/").pop()}`)}>View</Button>,
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
