import { useState, useCallback } from "react";
import { useActionData, useNavigate, useFetcher } from "react-router";
import {
  Card,
  FormLayout,
  TextField,
  DropZone,
  Banner,
  Button,
  Select,
  Page,
  InlineStack,
  Thumbnail,
  Text,
} from "@shopify/polaris";

export default function ProductCreate() {
  const actionData = useActionData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [formData, setFormData] = useState({
    title: "",
    status: "ACTIVE",
    image: null,
  });

  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = useCallback((_dropped, accepted) => {
    setFormData((prev) => ({ ...prev, image: accepted[0] }));
  }, []);

  const handleSubmit = () => {
    const data = new FormData();
    data.append("ProductName", formData.title);
    data.append("status", formData.status);
    if (formData.image) data.append("image", formData.image);

    fetcher.submit(data, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Draft", value: "DRAFT" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <Page
      title="Add Product"
      backAction={{ onAction: () => navigate("/app/product") }}
    >
      {actionData?.error && (
        <Banner tone="critical" title="Error">
          <Text>{actionData.error}</Text>
        </Banner>
      )}

      <Card>
        <FormLayout>
          <TextField
            label="Product Name"
            name="title"
            value={formData.title}
            onChange={(v) => handleChange(v, "title")}
            autoComplete="off"
          />

          <Select
            label="Status"
            name="status"
            options={statusOptions}
            value={formData.status}
            onChange={(v) => handleChange(v, "status")}
          />

          <DropZone label="Product Image" accept="image/*" onDrop={handleDrop}>
            {formData.image ? (
              <Thumbnail
                source={URL.createObjectURL(formData.image)}
                alt={formData.image.name}
                size="large"
              />
            ) : (
              <DropZone.FileUpload />
            )}
          </DropZone>

          <InlineStack gap="300">
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={fetcher.state === "submitting"}
            >
              Create Product
            </Button>
            <Button onClick={() => navigate("/app/product")}>Cancel</Button>
          </InlineStack>
        </FormLayout>
      </Card>
    </Page>
  );
}
