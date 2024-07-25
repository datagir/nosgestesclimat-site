import { skipTutorial } from '@/actions/actions'
import { getMatomoEventParcoursTestTutorialProgress } from '@/analytics/matomo-events'
import { MODEL_ROOT_RULE_NAME } from '@/components/publicodesUtils'
import SlidesLayout from '@/components/SlidesLayout'
import AutoCanonicalTag from '@/components/utils/AutoCanonicalTag'
import Meta from '@/components/utils/Meta'
import { useMatomo } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import { AppState } from '@/reducers/rootReducer'
import { enquêteSelector } from '@/sites/publicodes/enquête/enquêteSelector'
import HorizontalSwipe from '@/sites/publicodes/HorizontalSwipe'
import Categories from '@/sites/publicodes/tutorial/Categories'
import ClimateWarming from '@/sites/publicodes/tutorial/ClimateWarming'
import Instructions from '@/sites/publicodes/tutorial/Instructions'
import Target from '@/sites/publicodes/tutorial/Target'
import Slide from '@/sites/publicodes/tutorial/TutorialSlide'
import WarmingMeasure from '@/sites/publicodes/tutorial/WarmingMeasure'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const targetUrl = `/simulateur/${MODEL_ROOT_RULE_NAME}`

	const tutorials = useSelector((state: AppState) => state.tutorials)
	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const enquête = useSelector(enquêteSelector)
	const slides = createSlides(enquête)
	const index = tutos.length

	const { trackEvent } = useMatomo()

	const skip = useCallback(
		(name: string, unskip = false) => dispatch(skipTutorial(name, unskip)),
		[dispatch],
	)

	const last = index === slides.length - 1
	const next = () => {
		trackEvent(getMatomoEventParcoursTestTutorialProgress(last, index + 1))
		skip(last ? 'testIntro' : 'testIntro' + index)
		if (last) {
			navigate(targetUrl, { replace: true })
		}
	}
	const previous = () => skip('testIntro' + (index - 1), true)

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	const Component = slides[index]

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we correct the bug in the user's cache
	useEffect(() => {
		if (Object.keys(tutorials).includes('testIntro5')) {
			skip('testIntro')
		}
	}, [tutorials, skip])

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we avoid an error
	if (null === slides[index]) {
		return null
	}

	const title = 'Tutorial'
	const description =
		'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'

	return (
		<>
			<Meta title={title} description={description} />
			<AutoCanonicalTag />
			<SlidesLayout length={slides.length} active={index}>
				<HorizontalSwipe {...{ next, previous }}>
					<Slide
						{...{
							last,
							skip,
							targetUrl,
						}}
					>
						<Component />
					</Slide>
				</HorizontalSwipe>
			</SlidesLayout>
		</>
	)
}

const createSlides = (noBias) => {
	if (noBias) {
		return [ClimateWarming, WarmingMeasure, Instructions]
	}
	return [ClimateWarming, WarmingMeasure, Target, Categories, Instructions]
}
