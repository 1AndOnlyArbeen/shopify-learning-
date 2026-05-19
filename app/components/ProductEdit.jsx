import { useLoaderData, useNavigate } from "react-router";
import {
  Card,
  DataTable,
  Thumbnail,
  Badge,
  Button,
  Page,
} from "@shopify/polaris";

export default function ProductEdit() {
  const navigate = useNavigate();
  const loader = useLoaderData();

  return (
    <Page>
      <Button onClick={() => navigate(`/app/product/${p.id.split("/").pop()}`)}>
        edit
      </Button>
      ,
    </Page>
  );
}
