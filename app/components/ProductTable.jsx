import { useNavigate } from "react-router";
import { Card, DataTable, Thumbnail, Badge, Button, Pagination } from "@shopify/polaris";

export default function ProductTable({ products , pageInfo }) {
  const navigate = useNavigate();

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "text"]}
        headings={["Image", "Title", "Status", "Action"]}
        rows={products.map((p) => [
          <Thumbnail source={p.image} alt={p.title} size="small" />,
          p.title,
          <Badge>{p.status}</Badge>,
          <Button variant="plain" onClick={() => navigate(`/app/product/${p.id.split("/").pop()}`)}>
            View
          </Button>,
          <Pagination 
          hasNext={pageInfo.hasNextPage}
          onNext = {()=>navigate('?curosr=${pageInfo.endCursor}')}
          >
          </Pagination>
        ])}
      />
    </Card>
  );
}
