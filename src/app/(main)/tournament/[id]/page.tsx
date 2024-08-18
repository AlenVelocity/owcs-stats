import { fetchChampionship, fetchMatches } from './actions'
import MatchesList from './MatchesList'

export default async function MatchesPage({ params }: { params: { id: string } }) {
	const initialMatches = await fetchMatches(params.id, 'all', 0, 10)
	const championship = await fetchChampionship(params.id)

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-12">
			{/*
				style={{ backgroundImage: `url(${championship.cover_image || championship.background_image})` }}
			 */}
			<div className="w-full space-y-4">
				<h1 className="text-2xl font-bold">{championship.name}</h1>
				<MatchesList initialMatches={initialMatches} tournamentId={params.id} />
			</div>
		</main>
	)
}
