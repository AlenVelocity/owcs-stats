'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Overview from './overview'
import Rounds from './rounds'
import { MatchDetails, MatchStats } from '@/lib/faceit'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MatchTabs({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const activeTab = searchParams.get('tab') || 'overview'

	useEffect(() => {
		if (!searchParams.get('tab')) {
			const params = new URLSearchParams(searchParams)
			params.set('tab', 'overview')
			router.replace(`?${params.toString()}`)
		}
	}, [searchParams, router])

	const handleTabChange = (tab: string) => {
		const params = new URLSearchParams(searchParams)
		params.set('tab', tab)
		// Preserve other parameters
		const groupBy = params.get('groupBy')
		const showFaceit = params.get('showFaceit')
		const round = params.get('round')
		const sortColumn = params.get('sortColumn')
		const sortDirection = params.get('sortDirection')
		if (groupBy) params.set('groupBy', groupBy)
		if (showFaceit) params.set('showFaceit', showFaceit)
		if (round && tab === 'rounds') params.set('round', round)
		if (sortColumn) params.set('sortColumn', sortColumn)
		if (sortDirection) params.set('sortDirection', sortDirection)
		router.push(`?${params.toString()}`)
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange}>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="rounds">Round Stats</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">
				<Overview match={match} />
			</TabsContent>
			<TabsContent value="rounds">
				<Rounds match={match} />
			</TabsContent>
		</Tabs>
	)
}
