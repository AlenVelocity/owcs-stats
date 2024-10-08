import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		template: '%s | OWCS Stats',
		default: 'OWCS Stats'
	},
	description: 'Overwatch Champions Series Stats Simplified',
	openGraph: {
		title: {
			template: '%s | OWCS Stats',
			default: 'OWCS Stats'
		},
		images: ['/og-image.png'],
		description: 'Overwatch Champions Series Stats Simplified'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<Header />
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
