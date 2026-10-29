/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Fotos del catálogo, servidas por el CDN de Sanity (solo las de este proyecto).
    remotePatterns: [
      new URL(
        `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET ?? "production"}/**`,
      ),
    ],
  },
};

export default nextConfig;
