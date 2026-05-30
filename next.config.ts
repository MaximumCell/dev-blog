import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // mermaid is ESM-only; point Turbopack at the pre-built ESM bundle directly
      mermaid: "./node_modules/mermaid/dist/mermaid.esm.min.mjs",
    },
  },
};

export default nextConfig;
