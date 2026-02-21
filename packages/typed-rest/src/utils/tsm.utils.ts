import {
  Project,
  SourceFile,
  ModuleDeclaration,
  VariableDeclarationKind,
  ts,
} from "ts-morph";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const dummyFile = ts.createSourceFile("temp.ts", "", ts.ScriptTarget.Latest);

export namespace tsmUtils {
  export function codeStringToExpression(code: string): ts.Expression {
    const project = new Project();
    // We create a virtual file to "read" the code string
    const tempFile = project.createSourceFile("temp.ts", `const x = ${code}`);
    const declaration = tempFile.getVariableDeclarationOrThrow("x");
    return declaration.getInitializerOrThrow().compilerNode as ts.Expression;
  }

  export const printNode = (node: ts.Node): string => {
    return printer.printNode(ts.EmitHint.Unspecified, node, dummyFile);
  };

  export const printNode_old = (node: ts.Node): string => {
    // 1. Create a printer
    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });

    // 2. Create a dummy source file to give the node context
    const resultFile = ts.createSourceFile(
      "temp.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS,
    );

    // 3. Print the node
    return printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
  };

  export function writeObjectToModule(
    objectLiteral: ts.ObjectLiteralExpression,
    sourceFile: SourceFile | ModuleDeclaration,
    namespaceName: string,
  ) {
    // use the other utility if sourceFile is a module
    if (sourceFile instanceof ModuleDeclaration) {
      writeObjectToNamespace(objectLiteral, sourceFile, namespaceName);
      return;
    }

    // if sourcefile is actually a source file
    const writeAst = (writer: any) => {
      const printer = ts.createPrinter();
      writer.write(
        printer.printNode(
          ts.EmitHint.Expression,
          objectLiteral,
          sourceFile.compilerNode,
        ),
      );
    };
    sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: "somevariable",
          initializer: writeAst, // <--- Inject AST here
        },
      ],
    });
  }

  export function writeObjectToNamespace(
    objectLiteral: ts.ObjectLiteralExpression,
    sourceFile: ModuleDeclaration,
    namespaceName: string,
  ) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    // 2. Add it to the namespace as a variable (e.g., 'config' or 'route')
    sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: namespaceName,
          initializer: (writer) => {
            // We create a "dummy" source file for the printer to use as context
            const result = printer.printNode(
              ts.EmitHint.Expression,
              objectLiteral,
              ts.createSourceFile(
                "temp.ts",
                "",
                ts.ScriptTarget.Latest,
                false,
                ts.ScriptKind.TS,
              ),
            );
            writer.write(result);
          },
        },
      ],
    });
  }
}
