import type { NextConfig } from 'next';
import path from 'path';

// Nếu đang chạy trên máy chủ Cloudflare (CF_PAGES = 1), dùng thẳng đường dẫn tuyệt đối của họ.
// Nếu đang chạy dưới máy tính local của bạn, dùng process.cwd() để lùi ra 2 cấp an toàn.
const workspaceRoot = process.env.CF_PAGES
  ? '/opt/buildhome/repo'
  : path.resolve(process.cwd(), '../../');

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,

  experimental: {
    // @ts-expect-error: Bỏ qua lỗi Type do Next.js chưa cập nhật kịp thư viện Types cho turbopack
    turbopack: {
      root: workspaceRoot,
    },
  },

  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

export default nextConfig;