import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Redux Toolkit Post Manager | Dashboard" },
      {
        name: "description",
        content:
          "A responsive post management dashboard demonstrating Redux Toolkit slices, selectors, thunks and CRUD operations in React.",
      },
      { property: "og:title", content: "Redux Toolkit Post Manager" },
      {
        property: "og:description",
        content:
          "Manage posts and platforms with Redux Toolkit: slices, async thunks and full CRUD in a clean admin dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
