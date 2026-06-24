import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Chỉ định thư mục gốc của Monorepo (lùi ra 2 cấp: apps -> root)
  outputFileTracingRoot: path.join(__dirname, '../../'),

  experimental: {
    // @ts-expect-error: Bỏ qua lỗi Type do Next.js chưa cập nhật kịp thư viện Types cho turbopack
    turbopack: {
      root: path.join(__dirname, '../../'),
    },
  },

  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

export default nextConfig;