import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import { PlacementReadiness } from "@/components/career/PlacementReadiness";
import { AuthCard } from "@/components/landing/AuthCard";

/** Right-hand product surface: auth card plus live readiness signals. */
export function AuthPreview() {
  return (
    <div id="get-started" className="relative scroll-mt-24">
      <div className="flex justify-center lg:justify-end">
        <AuthCard />
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
        <div className="surface-panel hover-lift rounded-2xl p-4">
          <CareerReadinessRing value={72} caption="+12%" size={72} />
        </div>
        <PlacementReadiness score={78} delta={9} />
      </div>
    </div>
  );
}
