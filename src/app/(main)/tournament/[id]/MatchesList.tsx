'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Matches from './Matches'
import { fetchMatches } from './actions'
import { ChampionshipMatches } from '@/lib/faceit'
import { CircleDotIcon } from 'lucide-react'

export default function MatchesList({
	initialMatches,
	tournamentId
}: {
	initialMatches: ChampionshipMatches
	tournamentId: string
}) {
	const [matches, setMatches] = useState(initialMatches.items)
	const [offset, setOffset] = useState(10)
	const [isLoading, setIsLoading] = useState(false)
	const [type, setType] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all')

	const loadMore = async () => {
		setIsLoading(true)
		const newMatches = await fetchMatches(tournamentId, type, offset, 10)
		setMatches([...matches, ...newMatches.items])
		setOffset(offset + 10)
		setIsLoading(false)
	}

	const handleTypeChange = async (newType: 'all' | 'upcoming' | 'ongoing' | 'past') => {
		setType(newType)
		const filteredMatches = await fetchMatches(tournamentId, newType, 0, 10)
		setMatches(filteredMatches.items)
		setOffset(10)
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Recent Matches</h2>
				<Select onValueChange={handleTypeChange} defaultValue={type}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select match type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="upcoming">Upcoming</SelectItem>
						<SelectItem value="ongoing">Ongoing</SelectItem>
						<SelectItem value="past">Past</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Matches matches={matches} />
			{isLoading ? (
				<div className="flex justify-center">
					<CircleDotIcon className="animate-pulse" />
				</div>
			) : null}

			<div className="flex justify-center">
				<Button variant={'ghost'} onClick={loadMore}>
					Load More
				</Button>
			</div>
		</div>
	)
}
