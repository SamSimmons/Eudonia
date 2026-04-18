import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json" with { type: "json" };

const externalIds = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const external = (id) =>
  externalIds.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default {
  input: {
    layout: "src/layout.ts",
    components: "src/components.ts",
  },
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
  },
  external,
  plugins: [
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
      tsconfig: "./tsconfig.json",
    }),
  ],
};
