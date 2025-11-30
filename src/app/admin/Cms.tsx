"use client";

import { useEffect } from "react";

export default function Cms() {
  useEffect(() => {
    (async () => {
      const CMS = (await import("decap-cms-app")).default;
      
      CMS.init({
        config: {
          backend: {
            name: "git-gateway",
          },
          media_folder: "public/uploads",
          public_folder: "/uploads",
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

  return null;
}
