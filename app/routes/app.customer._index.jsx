import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import { asyncHandler } from "../lib/asyncHandler";
import { getCustomers } from "../services/customer.server";
import { Page, Button } from "@shopify/polaris";
import CustomerTable from "../components/CustomerTable";

export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { customers } = await getCustomers(admin);
  return data({ customers });
});

export default function CustomerListPage() {
  const { customers } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page
      title="Customers"
      primaryAction={
        <Button variant="primary" onClick={() => navigate("/app/customer/new")}>
          Add Customer
        </Button>
      }
    >
      <CustomerTable customers={customers} />
    </Page>
  );
}

