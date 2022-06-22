/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   webpack: (config, options) => {
//     config.module.rules.push({
//       test: /\.(glsl|vs|fs|vert|frag)$/,
//       use: ["raw-loader", "glslify-loader"],
//     });

//     return config;
//   },
// };

const withPWA = require("next-pwa");

// import withPWA from "next-pwa";

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    // disable: process.env.NODE_ENV === "development",
  },
  reactStrictMode: true,
  // for algolia
  webpack5: true,
  webpack: (config, options) => {
    //for pastel filter
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
    });
    //for algolia
    config.resolve.fallback = { fs: false };

    return config;
  },
});
