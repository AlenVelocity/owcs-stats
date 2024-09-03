'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { checkIfMatchExists, getMatch } from './match/[id]/actions'
import { redirect, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
const parseMatchId = (link: string) => {
	if (!link.includes('/')) return link
	if (!link.includes('faceit.com')) return null
	const urlPattern = /(?:https?:\/\/)?(?:www\.)?faceit\.com\/.*?\/room\/([^\/]+)/i
	const match = link.match(urlPattern)

	if (match) {
		return match[1]
	}

	const matchIdPattern = /^[0-9a-f]{1}-[0-9a-f-]{36}$/i
	if (matchIdPattern.test(link)) {
		return link
	}

	return null
}

export default function Finder() {
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [link, setLink] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!link) return
		setIsLoading(true)
		const matchId = parseMatchId(link)
		if (!matchId) {
			toast({
				title: 'Invalid link',
				variant: 'destructive',
				description: 'Please check the link and try again.'
			})
			setIsLoading(false)
			setLink('')
			return
		}
		const match = await checkIfMatchExists(matchId as string)

		if (match) {
			router.push(`/match/${matchId}`)
		} else {
			toast({
				title: 'Match not found',
				variant: 'destructive',
				description: 'Please check the link and try again.'
			})
		}
		setIsLoading(false)
		setLink('')
	}

	return (
		<div className="w-full max-w-sm space-y-4">
			<form onSubmit={handleSubmit} className="flex items-center space-x-2">
				<Input
					type="text"
					placeholder="Enter a Match Link or ID"
					value={link}
					onChange={(e) => setLink(e.target.value)}
					disabled={isLoading}
					required
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading
						</>
					) : (
						'Submit'
					)}
				</Button>
			</form>
		</div>
	)
}
