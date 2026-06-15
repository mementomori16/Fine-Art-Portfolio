import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  sassOptions: {
    includePaths: ['./'],
    // Adding explicit types to parameters to clear the TypeScript 'any' compilation block
    additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
      const { resourcePath } = loaderContext;
      
      // Safeguard: Prevent global.scss from loading itself recursively
      if (resourcePath.endsWith('global.scss')) {
        return content;
      }
      return `@use "app/global.scss" as *;\n${content}`;
    },
  },
};

export default nextConfig;
