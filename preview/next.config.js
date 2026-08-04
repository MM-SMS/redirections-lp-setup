/** @type {import('next').NextConfig} */
const nextConfig = {
  // The LP route handler reads src/templates/public/lp at runtime via a
  // dynamically built path, so Next's automatic file tracing can't see it
  // statically. Tell it explicitly to bundle those files for that route.
  // Requires Vercel's "Include source files outside of the Root Directory
  // in the Build Step" setting to be enabled for this project.
  experimental: {
    outputFileTracingIncludes: {
      "/lp/[...slug]": ["../src/templates/public/lp/**/*"],
    },
  },
  // LP asset trees are huge (images/video). Watching them blows the macOS
  // file-descriptor limit (EMFILE) and Next then fails to discover routes,
  // so / and /lp/* 404 in `next dev`. Runtime fs reads still work without watch.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/src/templates/public/lp/**",
        ],
      }
    }
    return config
  },
}

module.exports = nextConfig
