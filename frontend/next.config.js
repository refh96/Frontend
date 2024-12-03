/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ibb.co'], // Agrega aquí los dominios permitidos
  },
};

module.exports = nextConfig;
