'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Calendar, Users, X } from 'lucide-react'
import { ChampionshipDetails } from '@/lib/faceit'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function ChampionshipsList({ initialChampionships }: { initialChampionships: ChampionshipDetails[] }) {
	const [championships, setChampionships] = useState(initialChampionships)
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ongoing', 'finished'])

	const handleStatusChange = (status: string) => {
		setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
	}

	const removeStatus = (status: string) => {
		setSelectedStatuses((prev) => prev.filter((s) => s !== status))
	}

	const filteredChampionships = championships.filter(
		(championship) => selectedStatuses.length === 0 || selectedStatuses.includes(championship.status)
	)

	return (
		<div className="w-full space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Tournaments</h1>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Filter by Status</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuCheckboxItem
							checked={selectedStatuses.includes('join')}
							onCheckedChange={() => handleStatusChange('join')}
						>
							Upcoming
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={selectedStatuses.includes('ongoing')}
							onCheckedChange={() => handleStatusChange('ongoing')}
						>
							Ongoing
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={selectedStatuses.includes('finished')}
							onCheckedChange={() => handleStatusChange('finished')}
						>
							Finished
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex flex-wrap gap-2">
				{selectedStatuses.map((status) => (
					<Badge key={status} variant="secondary" className="px-2 py-1">
						{status === 'join' ? 'Upcoming' : status === 'ongoing' ? 'Ongoing' : 'Finished'}
						<button onClick={() => removeStatus(status)} className="ml-2">
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredChampionships.reverse().map((championship) => (
					<Link href={`/tournament/${championship.championship_id}`} key={championship.championship_id}>
						<Card className="hover:bg-muted/50 transition-colors">
							<CardHeader>
								<CardTitle className="text-xl">{championship.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<span className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<p className="text-sm text-muted-foreground">
										{'Start: '}
										{new Date(championship.championship_start * 1000).toLocaleString('en-US', {
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</span>
								<span className="flex items-center gap-2">
									<Users className="w-4 h-4" />
									<p className="text-sm text-muted-foreground">
										{`Participants: ${championship.current_subscriptions}`}
									</p>
								</span>
								<Badge
									className={cn(
										'text-sm',
										championship.status === 'join'
											? 'bg-primary'
											: championship.status === 'ongoing'
												? 'bg-secondary'
												: 'bg-destructive'
									)}
								>
									{championship.status === 'join'
										? 'Upcoming'
										: championship.status === 'ongoing'
											? 'Ongoing'
											: 'Finished'}
								</Badge>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}
