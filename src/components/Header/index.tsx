import Link from 'next/link'

import { ModeToggle } from './ModeToggle'

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center justify-between">
				<div className="flex flex-row space-x-2">
					<Link href="/">
						<span className="font-bold">
							<span className="text-primary">OWCS</span> Stats
						</span>
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-end">
					<ModeToggle />
				</div>
			</div>
		</header>
	)
}
