import { authenticate } from "../shopify.server";
import { redirect, Form, useActionData, useNavigate } from "react-router";
import { data } from "react-router";
import { apiError } from "../lib/apiError";
import { asyncHandler } from "../lib/asyncHandler";

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
  // authenticate if he is the amdin or not
  const { admin } = await authenticate.admin(request);

  //get datafrom the form

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phoneNumber");

  console.log(firstName, lastName, email, phoneNumber);

  if (!firstName || !lastName || !email || !phoneNumber) {
    throw new apiError(400, " all field are required !");
  }

  // graph to mutate the data

  const response = await admin.graphql(
    `
        mutation customerCreate($input:CustomerInput!){
        customerCreate(input:$input){
        customer {
        id
        firstName
        lastName
        email
        phone
        }
        userErrors{
        field
        message
        
        }
        
        
        }

        }
        
        
        
        `,
    {
      variables: {
        input: { firstName, lastName, email, phone: phoneNumber },
      },
    },
  );

  const result = await response.json();
  //   if (!result) {
  //     throw new apiError(500, " failed to create custiomer details ");
  //   }

  console.log("Shopify result:", JSON.stringify(result, null, 2));
  if (result.errors) {
    return data({ error: result.errors.map((e) => e.message).join(", ") });
  }
const userErrors = result?.data?.customerCreate?.userErrors ?? [];
   if (userErrors.length > 0) {
    return data({ error: userErrors.map((e) => e.message).join(", ") });
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
