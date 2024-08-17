import { fetchMatches } from './actions'
import MatchesList from './MatchesList'

export default async function Home() {
	const initialMatches = await fetchMatches(process.env.CHAMPIONSHIP_ID as string, 'all', 0, 10)

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-12">
			<div className="w-full space-y-4">
				<MatchesList initialMatches={initialMatches} />
			</div>
		</main>
	)
}
