import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./Routes";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

const publishableKey =
  "pk_test_cHJpbWUtbW9uaXRvci01OC5jbGVyay5hY2NvdW50cy5kZXYk";
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
