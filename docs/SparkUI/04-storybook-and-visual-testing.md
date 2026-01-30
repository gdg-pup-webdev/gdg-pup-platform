**[⬅️ Previous: Using Spark UI](./03-using-spark-ui.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Styling & Theming ➡️](./05-styling-and-theming.md)**

---

# Storybook & Visual Testing

Storybook is the source of truth for Spark-UI components.

## Storybook responsibilities

Storybook documents:
- Component APIs
- Supported variants
- Visual states
- Interaction behavior
- Accessibility expectations

## Location

```tsx
apps/
└── storybook/
```

## Visual testing

Storybook also serves as the primary visual regression testing surface.

If a change breaks visuals in Storybook, it is considered a breaking UI change.

Every Spark-UI component **must** have a Storybook entry.

---

**[⬅️ Previous: Using Spark UI](./03-using-spark-ui.md)** | **[Back to Spark UI Docs](./README.md)** | **[Next: Styling & Theming ➡️](./05-styling-and-theming.md)**