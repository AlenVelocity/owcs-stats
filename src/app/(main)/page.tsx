import { fetchChampionships } from './actions'
import ChampionshipsList from './ChampionshipsList'

export default async function Home() {
	const initialChampionships = await fetchChampionships(process.env.FACEIT_ORGANIZER_ID!, {
		offset: 29,
		limit: 29
	})

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-12">
			<ChampionshipsList initialChampionships={initialChampionships.items} />
		</main>
	)
}
