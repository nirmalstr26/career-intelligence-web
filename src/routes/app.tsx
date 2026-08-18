import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { Protected } from "@/components/auth/Protected";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <Protected mode="app">
      <AppShell>
        <Outlet />
      </AppShell>
    </Protected>
  );
}
