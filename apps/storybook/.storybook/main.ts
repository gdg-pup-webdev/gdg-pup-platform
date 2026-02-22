import type { StorybookConfig } from '@storybook/nextjs-vite';

import { dirname, join } from "path"

import { fileURLToPath } from "url"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  "stories": [

    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding')
  ],
  "framework": getAbsolutePath('@storybook/nextjs-vite'),
  "staticDirs": [
    "../public"
  ],
  viteFinal: async (config) => {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const sparkUiPath = join(currentDir, '../../../packages/spark-ui/src');
    
    // Watch spark-ui source files for changes
    config.server = config.server || {};
    config.server.watch = {
      ...(config.server.watch || {}),
      ignored: ['!**/node_modules/@packages/spark-ui/**'],
    };

    // Resolve spark-ui to source files instead of dist
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@packages/spark-ui': sparkUiPath,
    };

    return config;
  },
};
export default config;