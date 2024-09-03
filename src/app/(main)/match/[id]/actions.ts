'use server'
import FaceitClient from '@/lib/faceit'

const faceit = new FaceitClient()

export async function getMatch(matchId: string) {
	const match = await faceit.getMatch(matchId)
	return match
}

export async function checkIfMatchExists(matchId: string) {
	try {
		const match = await faceit.getMatch(matchId)
		return match
	} catch (error) {
		return null
	}
}
