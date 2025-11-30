"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    (async () => {
      const CMS = (await import("decap-cms-app")).default;
      const response = await fetch('/admin/config.yml');
      const config = await response.text();
      
      CMS.init({
        config: {
          ...CMS.resolveConfig(config, {
            backend: {
              name: "git-gateway",
            },
            media_folder: "public/uploads",
            public_folder: "/uploads",
          })!,
          collections: [
            {
              name: "blog",
              label: "Blog",
              folder: "content/blog",
              create: true,
              slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
              fields: [
                { label: "Title", name: "title", widget: "string" },
                { label: "Publish Date", name: "date", widget: "datetime" },
                { label: "Author", name: "author", widget: "string" },
                { label: "Summary", name: "summary", widget: "text" },
                { label: "Image ID", name: "image_id", widget: "string" },
                { label: "Tags", name: "tags", widget: "list", field: { label: "Tag", name: "tag", widget: "string" } },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
          ],
        },
      });
    })();
  }, []);

  return <div />;
}
