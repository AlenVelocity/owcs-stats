'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<NextThemesProvider enableSystem={false} attribute="class" defaultTheme="dark">
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</NextThemesProvider>
	)
}
