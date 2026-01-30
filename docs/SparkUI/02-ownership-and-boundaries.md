**[⬅️ Previous: Introduction](./01-introduction.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Using Spark UI ➡️](./03-using-spark-ui.md)**

---

# Ownership & Boundaries

Clear ownership boundaries keep UI scalable and maintainable.

## What belongs in Spark-UI

Spark-UI contains:
- Reusable, brand-level UI components
- UI primitives and patterns
- Components independent of business logic

Examples:
- Button
- Input
- Modal
- Card
- Tabs

## What belongs in applications

Application code contains:
- Feature-specific components
- Route-aware or domain-aware UI
- Compositions of Spark-UI components

Examples:
- UserProfileCard
- EventDetailsPanel
- CheckoutSummary

## Rule of Thumb

If a component is reused across features or applications, it likely belongs in Spark-UI.

When in doubt, start in the app and promote once reuse is clear.

---

**[⬅️ Previous: Introduction](./01-introduction.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Using Spark UI ➡️](./03-using-spark-ui.md)**
