import { apiError } from "../lib/apiError";

export async function getCustomers(admin) {
  const response = await admin.graphql(`
    query GetCustomers {
      customers(first: 50) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
          }
        }
      }
    }
  `);

  const result = await response.json();

  if (!result) {
    throw new apiError(404, "Customer data not found");
  }

  const customers = result.data.customers.edges.map((e) => e.node);

  return { customers };
}

export async function createCustomer(admin, { firstName, lastName, email, phone }) {
  const response = await admin.graphql(
    `
    mutation CustomerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        input: { firstName, lastName, email, phone },
      },
    },
  );

  const result = await response.json();

  if (result.errors) {
    throw new apiError(500, result.errors.map((e) => e.message).join(", "));
  }

  const userErrors = result?.data?.customerCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    throw new apiError(400, userErrors.map((e) => e.message).join(", "));
  }

  return result.data.customerCreate.customer;
}
