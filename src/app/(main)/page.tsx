import { fetchChampionships } from './actions'
import ChampionshipsList from './ChampionshipsList'
import Finder from './Finder'

export default async function Component() {
	const initialChampionships = await fetchChampionships(process.env.FACEIT_ORGANIZER_ID!, {
		offset: 29,
		limit: 29
	})

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-12 mx-2">
			<main className="space-y-24">
				<section>
					<h2 className="text-4xl font-bold mb-8 text-center">OWCS Stats</h2>
					<div className="flex max-w-md mx-auto items-center justify-center">
						<Finder />
					</div>
				</section>

				<section>
					<ChampionshipsList initialChampionships={initialChampionships.items} />
				</section>
			</main>
		</div>
	)
}
