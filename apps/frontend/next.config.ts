import type { NextConfig } from "next";
import path from "path";

const workspaceRoot = process.env.CF_PAGES
  ? "/opt/buildhome/repo"
  : path.resolve(process.cwd(), "../../");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,

  turbopack: {
    root: workspaceRoot,
  },

  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

export default nextConfig;