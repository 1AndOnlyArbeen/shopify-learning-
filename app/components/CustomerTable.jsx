import { useNavigate } from "react-router";
import { Card, DataTable, EmptyState } from "@shopify/polaris";

export default function CustomerTable({ customers }) {
  const navigate = useNavigate();

  const rows = customers.map((c) => [
    c.firstName,
    c.lastName,
    c.email,
    c.phone || "-",
  ]);

  if (customers.length === 0) {
    return (
      <Card>
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
      </Card>
    );
  }

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "text"]}
        headings={["First Name", "Last Name", "Email", "Phone"]}
        rows={rows}
      />
    </Card>
  );
}
