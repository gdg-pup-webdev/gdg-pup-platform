import { ArticlesList } from "@/features/articles";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
 
export default function ArticlesPage() {
  return (
    <AdminPageScaffold pageKey="articles">
      <ArticlesList />
    </AdminPageScaffold>
  );
}
