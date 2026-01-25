when you need to refactor a code that is used by other teams, you are responsible for updating the code of the consumers.

however, the best solution that we can suggest in case that you need a specific function to work differently (changing it parameters) which is often a breaking change, is to fork the function and implement it separately.

e.g.
a component name is SubmitButtonHoveredGreen
and you need to change its props, but doing so may break other component that is using.
refactoring could be a lot of work so what you do instaed is to copy the component and rename it to SubmitButtonHoveredDynamicColor.

now, components that use SubmitButtonHoveredGreen and future components will start to use the SubmitButtonHoveredDynamicColor

if you intend to not use the SubmitButtonHoveredGreen anymore, rename it and add a \_DEPRECATED at the end of it to discourage developers from using it again.

to do so, you can use the rename symbol function (f2) in vscode to quickly update all instances of the symbol across the entire project.
