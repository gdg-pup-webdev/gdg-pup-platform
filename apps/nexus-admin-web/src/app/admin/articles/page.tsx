import { ArticlesList } from "@/features/articles";
 
export default function ArticlesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <p className="mt-1 text-gray-500">
          Curate and showcase the best moments from community events.
        </p>
      </div>

      {/* Main Content */}
      <ArticlesList />
    </div>
  );
}
