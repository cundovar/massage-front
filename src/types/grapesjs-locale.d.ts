declare module "grapesjs/locale/fr.mjs" {
  const messages: Record<string, unknown>;
  export default messages;
}

declare module "grapesjs-rte-extensions" {
  import type { Plugin } from "grapesjs";
  const plugin: Plugin<Record<string, unknown>>;
  export default plugin;
}

declare module "grapesjs-parser-postcss" {
  import type { Plugin } from "grapesjs";
  const plugin: Plugin;
  export default plugin;
}
