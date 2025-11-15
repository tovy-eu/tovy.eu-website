"use client";

import { useEffect } from "react";
import config from "../../../public/admin/config.yml";

export default function AdminPage() {
  useEffect(() => {
    (async () => {
      const CMS = (await import("decap-cms-app")).default;
      CMS.init({ config });
    })();
  }, []);

  return <div />;
}
