import { ScrollToTop } from '@/components/utils/Scroll'
import { WithEngine } from '@/RulesProvider'
import {
	answeredQuestionsSelector,
	useSimulationData,
	useTestCompleted,
} from '@/selectors/simulationSelectors'
import { simulationURL } from '@/sites/publicodes/conference/useDatabase'
import BannerContent from '@/sites/publicodes/enquête/BannerContent'
import { enquêteSelector } from '@/sites/publicodes/enquête/enquêteSelector'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'

export default () => {
	return (
		<WithEngine options={{ parsed: true, optimized: false }}>
			<BannerWithEngine />
		</WithEngine>
	)
}

export const minutes = 3

const uglyBannerContentColor = '#ffffbf' // Cannot make it work as an import in BannerContent, dunno why

const BannerWithEngine = () => {
	const enquête = useSelector(enquêteSelector)
	const [message, setMessage] = useState(null)
	const [timeMessage, setTimeMessage] = useState(false)

	const data = useSimulationData()
	const answeredQuestions = useSelector(answeredQuestionsSelector)

	useEffect(() => {
		if (!enquête) return
		// Say the user opened the enquête on two tabs
		// the first tab, where the test is not started yet, on the /enquête page for instance
		// could send a payload that overrides the simulation
		// with an empty simulation in parallel of the working tab, whose results
		// are regularly erased
		// When the simulation is started though, it's ok : it's stored and will be retrieved, even on F5 on the about page

		if (!answeredQuestions.length) return
		// This is a second check : if the user has an idle open tab, it shouldn't keep sending the server POST requests
		// could also be problematic in an unknown edge case
		if (!document.hasFocus()) return

		const postData = async () => {
			const body = { data, id: enquête.userID }
			console.log(body)
			try {
				const response = await fetch(simulationURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body), // body data type must match "Content-Type" header
				})
				await sleep(1000)
				const json = await response.json()
				setMessage({ text: '✔️  Sauvegardée' })
			} catch (e) {
				setMessage({ text: '❌ Erreur' })
				console.log(e)
			}
		}
		const postDaemon = setInterval(() => {
			setMessage({ text: '⌛️ Sauvegarde..' })
			postData()
		}, 5 * 1000)

		return () => clearInterval(postDaemon)
	}, [data, enquête])

	useEffect(() => {
		if (!enquête) return
		const endEnquêteDaemon = setInterval(() => {
			setTimeMessage(true)
		}, minutes * 60 * 1000)

		return () => clearInterval(endEnquêteDaemon)
	}, [enquête, minutes, setTimeMessage])
	const thinScreen = useMediaQuery('(max-width: 400px)')

	if (!enquête) {
		return null
	}
	const { userID } = enquête
	const testCompleted = useTestCompleted()
	const shouldDisplayTimeMessage = testCompleted && timeMessage

	const height = thinScreen ? 100 : 56
	const animationVariants = {
		mini: { height: '2rem' },
		large: { height: height + 'vh' },
	}

	return (
		<motion.div
			animate={shouldDisplayTimeMessage ? 'large' : 'mini'}
			variants={animationVariants}
			transition={{ delay: 0, duration: 1 }}
			css={`
				width: 100vw;
				height: 2rem;
				text-align: center;
				z-index: 1;
			`}
		>
			<div
				css={`
					background: yellow;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
				`}
			>
				<div>
					{testCompleted ? (
						<button onClick={() => setTimeMessage(true)}>
							⌛️ Vous avez terminé ?
						</button>
					) : (
						<Link to={`/enquête/${userID}`}>Vous participez à l'enquête</Link>
					)}
				</div>

				{message && <div>{message.text}</div>}
			</div>
			{shouldDisplayTimeMessage && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ delay: 0.4 }}
					css={`
						background: ${uglyBannerContentColor}; /*J'étais pas très inspiré là */
						height: ${height - 1}vh;
						@media (max-width: 380) {
							height: 100vh;
						}
					`}
				>
					<ScrollToTop />

					<BannerContent setTimeMessage={setTimeMessage} />
				</motion.div>
			)}
		</motion.div>
	)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
