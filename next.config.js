/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.aibase.cn',
      'aibase.cn',
      'www.qbitai.com',
      'qbitai.com',
      'www.jiqizhixin.com',
      'jiqizhixin.com'
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

module.exports = nextConfig
