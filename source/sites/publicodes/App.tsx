import * as Sentry from '@sentry/react'
import Logo from 'Components/Logo'
import Route404 from 'Components/Route404'
import { sessionBarMargin } from 'Components/SessionBar'
import 'Components/ui/index.css'
import React, { Suspense, useContext, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import AnimatedLoader from '../../AnimatedLoader'
import Footer from '../../components/Footer'
import LangSwitcher from '../../components/LangSwitcher'
import LocalisationMessage from '../../components/localisation/LocalisationMessage'
import { TrackerContext } from '../../contexts/TrackerContext'
import useMediaQuery from '../../hooks/useMediaQuery'
import Provider from '../../Provider'
import { AppState } from '../../reducers/rootReducer'
import { WithEngine } from '../../RulesProvider'
import { fetchUser, persistUser } from '../../storage/persistSimulation'
import {
	changeLangTo,
	getLangFromAbreviation,
	getLangInfos,
} from './../../locales/translation'
import GroupModeSessionVignette from './conference/GroupModeSessionVignette'
import EnquêteBanner from './enquête/BannerWrapper'
import Landing from './Landing'
import Navigation from './Navigation'
import About from './pages/About'
import Diffuser from './pages/Diffuser'
import Profil from './Profil.tsx'
import sitePaths from './sitePaths'
import TranslationContribution from './TranslationContribution'
import { isFluidLayout } from './utils'

// All those lazy components, could be probably be handled another more consise way
// Also, see this issue about migrating to SSR https://github.com/datagir/nosgestesclimat-site/issues/801

const ActionsLazy = React.lazy(() => import('./Actions'))
const QuestionList = React.lazy(() => import('./pages/QuestionList'))
const FinLazy = React.lazy(() => import('./fin'))
const SimulateurLazy = React.lazy(() => import('./Simulateur'))
const PetrogazLandingLazy = React.lazy(() => import('./pages/PetrogazLanding'))
const ModelLazy = React.lazy(() => import('./Model'))
const PersonasLazy = React.lazy(() => import('./Personas'))
const DocumentationLazy = React.lazy(() => import('./pages/Documentation'))
const TutorialLazy = React.lazy(() => import('./tutorial/Tutorial'))
const GroupSwitchLazy = React.lazy(() => import('./conference/GroupSwitch'))
const ContributionLazy = React.lazy(() => import('./Contribution'))
const ConferenceLazy = React.lazy(() => import('./conference/Conference'))
const StatsLazy = React.lazy(() => import('./pages/Stats'))
const SurveyLazy = React.lazy(() => import('./conference/Survey'))
const EnquêteLazy = React.lazy(() => import('./enquête/Enquête'))
const CGULazy = React.lazy(() => import('./pages/CGU'))
const PrivacyLazy = React.lazy(() => import('./pages/Privacy'))
const AccessibilityLazy = React.lazy(() => import('./pages/Accessibility'))
const GuideGroupeLazy = React.lazy(() => import('./pages/GuideGroupe'))
const International = React.lazy(() => import('./pages/International'))
const DocumentationContexteLazy = React.lazy(
	() => import('./pages/DocumentationContexte')
)
const News = React.lazy(() => import('Pages/news/News'))

// Do not export anything else than React components here. Exporting isFulidLayout breaks the hot reloading

export default function Root({}) {
	const paths = sitePaths()

	const iframeShareData = new URLSearchParams(
		document?.location.search.substring(1)
	).get('shareData')

	// We retrieve the User object from local storage to initialize the store.
	const persistedUser = fetchUser()
	// We use the 'currentSimulationId' pointer to retrieve the latest simulation in the list.
	const persistedSimulation = persistedUser.simulations.filter(
		(simulation) => simulation.id === persistedUser.currentSimulationId
	)[0]

	const currentLang =
		persistedUser?.currentLang ??
		getLangFromAbreviation(
			window.FORCE_LANGUAGE || window.navigator.language.toLowerCase()
		)

	return (
		<Provider
			sitePaths={paths}
			reduxMiddlewares={[]}
			onStoreCreated={(store) => {
				persistUser(store)
			}}
			initialStore={{
				simulation: persistedSimulation,
				simulations: persistedUser.simulations,
				currentSimulationId: persistedUser.currentSimulationId,
				tutorials: persistedUser.tutorials,
				localisation: persistedUser.localisation,
				currentLang,
				iframeOptions: { iframeShareData },
				actionChoices: persistedSimulation?.actionChoices ?? {},
				storedTrajets: persistedSimulation?.storedTrajets ?? {},
				storedAmortissementAvion:
					persistedSimulation?.storedAmortissementAvion ?? {},
				conference: persistedSimulation?.conference,
				survey: persistedSimulation?.survey,
				enquête: persistedSimulation?.enquête,
			}}
		>
			<Main />
		</Provider>
	)
}

const Main = ({}) => {
	const dispatch = useDispatch()
	const location = useLocation()
	const { i18n, t } = useTranslation()
	const [searchParams, _] = useSearchParams()
	const isHomePage = location.pathname === '/',
		isTuto = location.pathname.indexOf('/tutoriel') === 0

	const tracker = useContext(TrackerContext)
	const largeScreen = useMediaQuery('(min-width: 800px)')

	useEffect(() => {
		tracker?.track(location)
	}, [location])

	// Manage the language change from the URL search param
	const currentLangState = useSelector((state: AppState) => state.currentLang)
	const currentLangParam = searchParams.get('lang')

	if (i18n.language !== getLangInfos(currentLangState).abrv) {
		// sync up the [i18n.language] with the current lang stored in the persisiting state.
		changeLangTo(i18n, currentLangState)
	}
	useEffect(() => {
		if (currentLangParam && currentLangParam !== i18n.language) {
			// The 'lang' search param has been modified.
			const currentLang = getLangFromAbreviation(currentLangParam)
			changeLangTo(i18n, currentLang)
			dispatch({
				type: 'SET_LANGUAGE',
				currentLang,
			})
		}
	}, [currentLangParam])

	const fluidLayout = isFluidLayout(location.pathname)

	return (
		<Sentry.ErrorBoundary
			showDialog
			fallback={() => (
				<div
					css={`
						text-align: center;
					`}
				>
					<Logo showText size={largeScreen ? 'large' : 'medium'} />
					<h1>{t("Une erreur s'est produite")}</h1>
					<p
						css={`
							margin-bottom: 2rem;
						`}
					>
						{t(
							'Notre équipe a été notifiée, nous allons résoudre le problème au plus vite.'
						)}
					</p>
					<button
						className="ui__ button plain"
						onClick={() => {
							window.location.reload()
						}}
					>
						{t('Recharger la page')}
					</button>
				</div>
			)}
		>
			<>
				<EnquêteBanner />
				<div
					css={`
						@media (min-width: 800px) {
							display: flex;
							min-height: 100vh;
							padding-top: 1rem;
						}

						@media (min-width: 1200px) {
							${!fluidLayout &&
							`
						transform: translateX(-4vw);
						`}
						}
						${!fluidLayout && !isTuto && sessionBarMargin}
					`}
					className={fluidLayout ? '' : 'ui__ container'}
				>
					<Navigation fluidLayout={fluidLayout} />
					<main
						tabIndex="0"
						id="mainContent"
						css={`
							outline: none !important;
							padding-left: 0rem;
							overflow: auto;
							@media (min-width: 800px) {
								flex-grow: 1;
								${!fluidLayout ? 'padding-left: 0.6rem;' : ''}
							}
						`}
					>
						<GroupModeSessionVignette />
						{!isHomePage &&
							!isTuto &&
							!location.pathname.startsWith('/international') && (
								<LocalisationMessage />
							)}

						{fluidLayout && (
							<div
								css={`
									margin: 0 auto;
									@media (max-width: 800px) {
										margin-top: 0.6rem;
									}
									@media (min-width: 1200px) {
									}
								`}
							>
								<Logo showText size={largeScreen ? 'large' : 'medium'} />
							</div>
						)}
						{fluidLayout && <LangSwitcher from="landing" />}
						<Router />
					</main>
				</div>
				<Footer />
			</>
		</Sentry.ErrorBoundary>
	)
}

const Router = ({}) => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route
				path="documentation/*"
				element={
					<WithEngine options={{ parsed: false, optimized: false }}>
						<Suspense fallback={<AnimatedLoader />}>
							<DocumentationLazy />
						</Suspense>
					</WithEngine>
				}
			/>
			<Route
				path="questions"
				element={
					<WithEngine options={{ parsed: true, optimized: false }}>
						<Suspense fallback={<AnimatedLoader />}>
							<QuestionList />
						</Suspense>
					</WithEngine>
				}
			/>
			<Route
				path={'modèle'}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ModelLazy />
					</Suspense>
				}
			/>
			<Route
				path="simulateur/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<SimulateurLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/stats"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<StatsLazy />
					</Suspense>
				}
			/>
			<Route
				path="/fin/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<FinLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/personas"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<PersonasLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/actions/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<ActionsLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/profil"
				element={
					<WithEngine>
						<Profil />
					</WithEngine>
				}
			/>
			<Route
				path="/contribuer/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ContributionLazy />
					</Suspense>
				}
			/>
			<Route
				path="/contribuer-traduction"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<TranslationContribution />
					</Suspense>
				}
			/>
			<Route path={'à-propos'} element={<About />} />
			<Route
				path="/cgu"
				element={
					<Suspense
						fallback={
							<div>
								<Trans>Chargement</Trans>
							</div>
						}
					>
						<CGULazy />
					</Suspense>
				}
			/>
			<Route path="/partenaires" element={<Diffuser />} />
			<Route path="/diffuser" element={<Diffuser />} />
			<Route
				path={'vie-privée'}
				element={
					<Suspense
						fallback={
							<div>
								<Trans>Chargement</Trans>
							</div>
						}
					>
						<PrivacyLazy />
					</Suspense>
				}
			/>
			<Route
				path={`nouveautés/*`}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<News />
					</Suspense>
				}
			/>
			<Route
				path="/guide"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path="/guide/:encodedName"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path={`conférence/:room`}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ConferenceLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GroupSwitchLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe/documentation-contexte"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<DocumentationContexteLazy />
					</Suspense>
				}
			/>
			<Route
				path="/sondage/:room"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<SurveyLazy />
					</Suspense>
				}
			/>
			<Route
				path="/enquête/:userID?"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<EnquêteLazy />
					</Suspense>
				}
			/>
			<Route
				path="/accessibilite"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<AccessibilityLazy />
					</Suspense>
				}
			/>
			<Route
				path="/tutoriel"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<TutorialLazy />
					</Suspense>
				}
			/>
			<Route
				path={`/pétrole-et-gaz`}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<PetrogazLandingLazy />
					</Suspense>
				}
			/>
			<Route
				path={`/international`}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<International />
					</Suspense>
				}
			/>
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
