export abstract class TsThing {
  abstract getString(): string;

  /**
   * Helper to add a tab to every line of a string.
   * This allows children to be "unaware" of their depth.
   */
  protected indent(str: string): string {
    return str
      .split("\n")
      .map((line) => (line.trim().length > 0 ? `\t${line}` : line))
      .join("\n");
  }
}

export class TsRawValue extends TsThing {
  constructor(public value: string) {
    super();
  }
  getString() {
    return this.value;
  }
}

export class TsObjectLiteral extends TsThing {
  public properties: Record<string, TsThing> = {};

  constructor(properties: Record<string, TsThing> = {}) {
    super();
    this.properties = properties;
  }

  addProperty(key: string, value: TsThing) {
    this.properties[key] = value;
    return this;
  }

  getString(): string {
    const props = Object.entries(this.properties)
      .map(([key, val]) => {
        // Indent the value if it spans multiple lines (like a nested object)
        const valStr = val.getString();
        return this.indent(`${key}: ${valStr}`);
      })
      .join(",\n");

    return `{\n${props}\n}`;
  }
}

export class TsVariable extends TsThing {
  constructor(
    public exported: boolean,
    public name: string,
    public value: TsThing,
  ) {
    super();
  }

  getString(): string {
    const prefix = this.exported ? "export " : "";
    return `${prefix}const ${this.name} = ${this.value.getString()};`;
  }
}

export class TsNamespace extends TsThing {
  children: TsThing[] = [];

  constructor(
    public exported: boolean,
    public name: string,
  ) {
    super();
  }

  getString(): string {
    const prefix = this.exported ? "export " : "";
    // Map children strings and indent the whole result
    const body = this.children
      .map((child) => this.indent(child.getString()))
      .join("\n\n");

    return `${prefix}namespace ${this.name} {\n${body}\n}`;
  }
}

export class TsTypeDeclaration extends TsThing {
  constructor(
    public exported: boolean,
    public name: string,
    public type: string,
  ) {
    super();
  }

  getString(): string {
    const prefix = this.exported ? "export " : "";
    return `${prefix}type ${this.name} = ${this.type};`;
  }
}

export class TsImportStatement extends TsThing {
  constructor(
    public name: string,
    public alias: string,
    public isDefault: boolean,
    public path: string,
  ) {
    super();
  }

  getString(): string {
    if (this.isDefault) {
      return `import ${this.name} from "${this.path}";`;
    } else if (this.alias === this.name) {
      return `import { ${this.name}   } from "${this.path}";`;
    } else {
      return `import { ${this.name} as ${this.alias} } from "${this.path}";`;
    }
  }
}

export class TsArrayLiteral extends TsThing {
  constructor(public elements: TsThing[] = []) { super(); }
  getString(): string {
    const body = this.elements.map(e => this.indent(e.getString())).join(",\n");
    return `[\n${body}\n]`;
  }
}

export class TsFile extends TsThing {
  // Use a Map to store unique imports
  // Key format: "path|alias"
  private importMap: Map<string, TsImportStatement> = new Map();
  children: TsThing[] = [];

  constructor() {
    super();
  }

  /**
   * Adds an import statement, preventing duplicates by path and alias.
   */
  addImport(importStmt: TsImportStatement) {
    // Create a unique key based on the module path and the local alias/name
    const uniqueKey = `${importStmt.path}|${importStmt.alias}`;

    if (!this.importMap.has(uniqueKey)) {
      this.importMap.set(uniqueKey, importStmt);
    }
    
    return this;
  }

  addStatement(statement: TsThing) {
    this.children.push(statement);
    return this;
  }

  getString(): string {
    // Convert Map values back to an array for rendering
    const uniqueImports = Array.from(this.importMap.values());
    
    // Optional: Sort imports alphabetically by path for cleaner output
    uniqueImports.sort((a, b) => a.path.localeCompare(b.path));

    const importsString = uniqueImports
      .map((imp) => imp.getString())
      .join("\n");

    const bodyString = this.children
      .map((child) => child.getString())
      .join("\n\n");

    return [importsString, "", bodyString].join("\n").trim();
  }
}


export class TsFile_DEPRECATED extends TsThing {
  imports: TsImportStatement[] = [];
  children: TsThing[] = [];

  constructor() {
    super();
  }

  addImport(importStmt: TsImportStatement) {
    this.imports.push(importStmt);
    return this;
  }

  addStatement(statement: TsThing) {
    this.children.push(statement);
    return this;
  }

  getString(): string {
    const importsString = this.imports.map((imp) => imp.getString()).join("\n");
    const bodyString = this.children
      .map((child) => child.getString())
      .join("\n\n");

    return [importsString, "", bodyString].join("\n").trim();
  }
}
