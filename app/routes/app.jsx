import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
  import { AppProvider as PolarisAppProvider } from "@shopify/polaris";         
  import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
  import enTranslations from "@shopify/polaris/locales/en.json"; 
import { authenticate } from "../shopify.server";


// "links" is a React Router export that injects <link> tags into <head>.
// We use it to load Polaris's stylesheet once for the whole /app/* tree.
// Without this, Polaris components render unstyled.
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    // OUTER: Shopify's AppProvider — sets up App Bridge
    // (lets the app talk to the Shopify admin: auth, modals, navigation).
    <AppProvider embedded apiKey={apiKey}>
      {/*
        INNER: Polaris's AppProvider — provides i18n (translations) to every
        Polaris component (DataTable, Page, Card, EmptyState, ...).
        Without this you get: "MissingAppProviderError: No i18n was provided".
        Placed here once so every child route under /app/* inherits it via <Outlet />.
      */}
      <PolarisAppProvider i18n={enTranslations}>
        <s-app-nav>
          <s-link href="/app">Home</s-link>
          <s-link href="/app/additional">Additional page</s-link>
          <s-link href="/app/customer">customer</s-link>
          <s-link href="/app/product">product</s-link>
        </s-app-nav>
        <Outlet />
      </PolarisAppProvider>
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
