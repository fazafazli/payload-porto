// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true, // Move this out of experimental
//   // Remove the experimental.reactCompiler key if it exists
  
//   // Add turbopack config (can be empty if webpack config isn't needed)
//   turbopack: {
//     resolveAlias: {
//       "@payload-config": "./payload.config.ts",
//     },
//   },
  
//   // If you need webpack config, migrate it to turbopack instead
//   // Otherwise, you can remove the webpack config entirely
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   experimental: {
//     turbopack: false,
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
  },
  // Remove reactCompiler from root level
};

export default withPayload(nextConfig);
