import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { dirname } from "path"
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
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding')
  ],
  "framework": getAbsolutePath('@storybook/react-vite'),
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
          "@ui": path.resolve(__dirname, "../src/shared/ui"),
          "@entities": path.resolve(__dirname, "../src/entities"),
          "@features": path.resolve(__dirname, "../src/features"),
          "@shared": path.resolve(__dirname, "../src/shared"),
          "@widgets": path.resolve(__dirname, "../src/widgets"),
          "@pages": path.resolve(__dirname, "../src/pages"),
          "@app": path.resolve(__dirname, "../src/app"),
          "@hooks": path.resolve(__dirname, "../src/hooks"),
          "@layouts": path.resolve(__dirname, "../src/layouts"),
          "@lib": path.resolve(__dirname, "../src/lib"),
          "@providers": path.resolve(__dirname, "../src/providers"),
          "@types": path.resolve(__dirname, "../src/types"),
          "@assets": path.resolve(__dirname, "../src/assets"),
          "@components": path.resolve(__dirname, "../src/components")
        },
      },
    });
  },
};

export default config;