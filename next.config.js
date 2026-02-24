/** @type {import('next').NextConfig} */
const isGHPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  devIndicators: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ...(isGHPages && { output: 'export' }),
}

module.exports = nextConfig
