'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

declare namespace document {
	function startViewTransition(callback: () => void): void
}

export function ModeToggle() {
	const { setTheme, theme } = useTheme()
	const toggle = () => {
		if (!document.startViewTransition) {
			setTheme(theme === 'dark' ? 'light' : 'dark')
		} else {
			document.startViewTransition(() => {
				setTheme(theme === 'dark' ? 'light' : 'dark')
			})
		}
	}

	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			const visited = window.localStorage.getItem('visited')
			if (!visited) {
				window.localStorage.setItem('visited', 'true')
			}
		}
	}, [])

	return (
		<Button variant={'outline'} size={'icon'} onClick={toggle}>
			<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
