import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json" with { type: "json" };

const srcDir = `${import.meta.dirname}/src`;

const externalIds = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const external = (id) =>
  externalIds.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default {
  input: {
    layout: `${srcDir}/layout.ts`,
    components: `${srcDir}/components.ts`,
  },
  output: {
    dir: `${import.meta.dirname}/dist`,
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: srcDir,
    entryFileNames: "[name].js",
  },
  external,
  plugins: [
    alias({ entries: [{ find: /^@\/(.*)$/, replacement: `${srcDir}/$1` }] }),
    nodeResolve({ extensions: [".ts", ".tsx", ".js", ".jsx"] }),
    postcss({
      modules: {
        generateScopedName: "eudonia_[local]_[hash:base64:5]",
      },
      extract: "components.css",
      minimize: true,
    }),
    esbuild({
      target: "es2022",
      jsx: "automatic",
      tsconfig: `${import.meta.dirname}/tsconfig.json`,
    }),
  ],
};
