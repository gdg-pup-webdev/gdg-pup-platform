some code doesnt need documentation. it is important that you keep your code self documenting.

functions such as getUserCount inside a database repository class doesnt need a comment explaining that it return the count of the user.

however, there are times that the context or the file structure is not enough to explain what a piece of code does. in such cases, you can use the following guides on how to document your code.

classes

- put a summary documentation at the top of each class.
- explain what it is for, and is its intended use, and how to use it.

functions and methods

- put a summary documentation at the top of each function or method.
- explain what it is for, and is its intended use, and how to use it.
- short explanation on the steps that it do to do the process

variable declaration

- variable names should be clear enough to understand the purpose of the variable.
- avoid putting a comment before each variable documentation unless with enough justification
- you can put a comment on top of a group of variables to signify they those variables work together.

code blocks

- code blocks can include if else blocks, try catch, while, or group of lines of code.
- small code blocks must be clear and understandable enough to understand its purpose.
- for large code blocks, it is recommended to put a summary documentation at the top of the block and explain the purpose and steps of the process of the block.
- If the code is doing something unusual (e.g., a workaround for a known library bug or a specific performance optimization), the documentation must explain the "Why." A developer can see what the code does by reading it, but they can't see the history or constraints that led to that specific implementation.
