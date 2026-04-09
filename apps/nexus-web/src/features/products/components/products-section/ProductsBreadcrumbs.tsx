import { Breadcrumbs } from "../Breadcrumbs";

export function ProductsBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Products" },
      ]}
    />
  );
}
