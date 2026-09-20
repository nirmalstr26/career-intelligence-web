import { createFileRoute } from "@tanstack/react-router";
import { TermsOfServicePage } from "./terms";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SPAR AI Career Intelligence" },
      {
        name: "description",
        content:
          "Terms of Service governing the use of the SPAR AI Career Intelligence platform, AI coaching tools, and student learning environments.",
      },
    ],
  }),
  component: TermsOfServicePage,
});
