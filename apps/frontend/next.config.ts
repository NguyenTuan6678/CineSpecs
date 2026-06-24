import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

// Tái tạo lại biến __dirname trong môi trường ES Modules của TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Chỉ định thư mục gốc của Monorepo (lùi ra 2 cấp: apps -> root)
  outputFileTracingRoot: path.join(__dirname, '../../'),

  experimental: {
    turbopack: {
      // Đảm bảo Turbopack nhận diện đúng Root Workspace
      root: path.join(__dirname, '../../'),
    },
  },

  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

export default nextConfig;