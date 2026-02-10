"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css"; // Don't forget the CSS!

export default function ApiDocs() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "http://localhost:8000/docs.json",
        // This enables the "Try It Out" feature
        hideTestRequestButton: false,
        theme: "moon",
      }}
    />
  );
}
