import { BevyEventsList } from "@/features/bevy-events";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function BevyEventsPage() {
  return (
    <AdminPageScaffold pageKey="bevyEvents">
      <BevyEventsList />
    </AdminPageScaffold>
  );
}

