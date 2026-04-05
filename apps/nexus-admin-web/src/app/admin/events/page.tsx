import { EventsList } from "@/features/events";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function EventsPage() {
  return (
    <AdminPageScaffold pageKey="events">
      <EventsList />
    </AdminPageScaffold>
  );
}
