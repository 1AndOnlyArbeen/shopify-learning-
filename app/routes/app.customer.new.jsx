import { authenticate } from "../shopify.server";
import { redirect, Form, useActionData, useNavigate } from "react-router";
import { data } from "react-router";
import { asyncHandler } from "../lib/asyncHandler";
import { createCustomer } from "../services/customer.server";

// from polaris
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  InlineStack,
} from "@shopify/polaris";
import { useState } from "react";

export const action = asyncHandler(async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phoneNumber");

  if (!firstName || !lastName || !email || !phoneNumber) {
    return data({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await createCustomer(admin, { firstName, lastName, email, phone: phoneNumber });
  } catch (err) {
    return data({ error: err.message }, { status: err.statusCode || 500 });
  }

  return redirect("/app/customer");
});

// ui

const CreateCustomer = () => {
  const actionData = useActionData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Page
      title="Add Customer"
      backAction={{ onAction: () => navigate("/app/customer") }}
    >
      {actionData?.error && (
        <Banner tone="critical" title="Error">
          {actionData.error}
        </Banner>
      )}
      <Card>
        <Form method="POST">
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(v) => handleChange(v, "firstName")}
                autoComplete="off"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(v) => handleChange(v, "lastName")}
                autoComplete="off"
              />
            </FormLayout.Group>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(v) => handleChange(v, "email")}
              autoComplete="off"
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(v) => handleChange(v, "phoneNumber")}
              autoComplete="off"
            />
            <InlineStack gap="300">
              <Button variant="primary" submit>
                Create Customer
              </Button>
              <Button onClick={() => navigate("/app/customer")}>Cancel</Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
};

export default CreateCustomer;
