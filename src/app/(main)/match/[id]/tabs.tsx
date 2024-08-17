'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Overview from './overview'
import Rounds from './rounds'
import { MatchDetails, MatchStats } from '@/lib/faceit'

export default function MatchTabs({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	return (
		<Tabs defaultValue="overview">
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
