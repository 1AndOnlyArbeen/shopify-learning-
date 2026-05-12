import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import { asyncHandler } from "../lib/asyncHandler";
import { getCustomers } from "../services/customer.server";
import {
    Page,
    Card,
    Button,
    DataTable,
    EmptyState,
} from "@shopify/polaris"

export const loader = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { customers } = await getCustomers(admin);
  return data({ customers });
});

//ui making 

const CustomerList = ()=>{
    const {customers} = useLoaderData();
    const navigate = useNavigate()
    // making it into array 
    const rows =customers.map((c)=>[
        c.firstName,
        c.lastName,
        c.email,
        c.phone || "-"
    ])

    return (
    <Page
      title="Customers"
      primaryAction={
        <Button
          variant="primary"
          onClick={() => navigate("/app/customer/new")}  // ← go to form
        >
          Add Customer
        </Button>
      }
    >
      <Card>
        {customers.length === 0 ? (
          <EmptyState
            heading="No customers yet"
            action={{
              content: "Add Customer",
              onAction: () => navigate("/app/customer/new"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Add your first customer to get started.</p>
          </EmptyState>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "text", "text"]}
            headings={["First Name", "Last Name", "Email", "Phone"]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );

}

export default CustomerList;

