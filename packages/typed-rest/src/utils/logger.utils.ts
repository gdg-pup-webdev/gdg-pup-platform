import { configs } from "#configs/configs.js";

export class Logger extends console.Console {
  constructor() {
    super(process.stdout, process.stderr);
  }

  // Use standard method syntax instead of arrow functions
  log(...data: any[]) {
    super.log(`[${configs.packageName}]`, ...data);
  }

  modelScanner(...data: any[]) {
    // Note: Console doesn't have a 'modelScanner',
    // so we use super.log to output the text
    super.log(`[${configs.packageName}][MODELS]`, ...data);
  }

  routeScanner(...data: any[]) {
    super.log(`[${configs.packageName}][ROUTES]`, ...data);
  }
}

export const logger = new Logger();
