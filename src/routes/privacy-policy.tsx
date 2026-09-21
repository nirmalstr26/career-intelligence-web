import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyPage } from "./privacy";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SPAR AI Career Intelligence" },
      {
        name: "description",
        content:
          "Privacy Policy for SPAR AI Career Intelligence platform, detailing our data collection, usage, protection policies, and strict adherence to Google API Services User Data Policy.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});
