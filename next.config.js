/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // for Github Pages, this should match project name, e.g. https://www.georgesung.com/tennis-match-simulator/
  basePath: "/tennis-match-simulator",
}

module.exports = nextConfig