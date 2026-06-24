const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),

  experimental: {
    turbopack: {
      root: path.join(__dirname, '../../'),
    },
  },

  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

module.exports = nextConfig;