general guidelines:

- group related logic into a single file as much as possisble.
- do not lend major business logic to an external utility function. utilities must be kept unaware of the underlying context by which it is being called.
