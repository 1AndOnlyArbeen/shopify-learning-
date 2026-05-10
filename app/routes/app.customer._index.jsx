import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import {apiError} from "../lib/apiError"
import { asyncHandler } from "../lib/asyncHandler";
import {
    Page,
    Card,
    Button,
    DataTable,
    EmptyState,

} from "@shopify/polaris"
import { A } from "node_modules/react-router/dist/development/context-DGGUoDIu.mjs";


// get the customer data from shopify

export const loader = asyncHandler(async({request})=>{
    const {admin} = await authenticate.admin(request);

    // graph 

      const response = await admin.graphql(`
    query getCustomers {
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

  // return json 
  const result = await response.json()
  if (!result) {
    throw new apiError(404, " customer data not found !")
    
  }

// making it into format 
  const customers = result.data.customers.edges.map((e)=>e.node)
  return data({customers})

})

//ui making 

const CustomerList = ()=>{
    // put the customer data into useActionData
    const {customers} = useLoaderData();
    console.log(customers)
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
<a href=""></a>

export default CustomerList;

