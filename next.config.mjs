/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      "fakestoreapi.com",
      "localhost",
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
