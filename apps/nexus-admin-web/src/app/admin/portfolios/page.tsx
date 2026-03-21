import { PortfolioList } from "@/features/portfolios";

export default function PortfoliosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
        <p className="mt-1 text-gray-500">
          View and manage community member portfolios.
        </p>
      </div>

      {/* Main Content */}
      <PortfolioList />
    </div>
  );
}
