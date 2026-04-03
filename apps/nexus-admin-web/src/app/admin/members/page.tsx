import { MemberList } from "@/features/members"; 
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function MembersPage() {
  return (
    <AdminPageScaffold pageKey="members">
      <MemberList />
    </AdminPageScaffold>
  );
}
