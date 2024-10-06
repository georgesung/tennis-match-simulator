/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'development' ? 'standalone' : 'export',
  images: {
    unoptimized: true,
  },
  // for Github Pages, this should match project name, e.g. https://www.georgesung.com/tennis-match-simulator/
  basePath: process.env.NODE_ENV === 'development' ? '': '/tennis-match-simulator',
}

module.exports = nextConfig