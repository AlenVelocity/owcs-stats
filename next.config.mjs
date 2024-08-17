/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'assets.faceit-cdn.net'
			},
			{
				hostname: 'distribution.faceit-cdn.net'
			}
		]
	}
}

export default nextConfig
