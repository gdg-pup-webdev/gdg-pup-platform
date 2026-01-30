**[⬅️ Previous: Ownership & Boundaries](./02-ownership-and-boundaries.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Storybook & Visual Testing ➡️](./04-storybook-and-visual-testing.md)**

---

# Using Spark-UI

Applications consume Spark-UI via workspace imports.

```tsx
import { Button, Card } from "@packages/spark-ui";
```
# Usage guidelines

- Prefer Spark-UI components over raw HTML
- Do not override Spark-UI styles ad-hoc
- Compose Spark-UI components inside feature components

Spark-UI defines **how UI looks and behaves.**
Applications define **what the UI does.**

---

**[⬅️ Previous: Ownership & Boundaries](./02-ownership-and-boundaries.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Storybook & Visual Testing ➡️](./04-storybook-and-visual-testing.md)**