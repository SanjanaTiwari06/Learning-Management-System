import { createRoot } from "react-dom/client";
import "./indexx.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

// for clerk
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);