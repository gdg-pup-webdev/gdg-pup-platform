import { PortfolioList } from "@/features/portfolios";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function PortfoliosPage() {
  return (
    <AdminPageScaffold pageKey="portfolios">
      <PortfolioList />
    </AdminPageScaffold>
  );
}
