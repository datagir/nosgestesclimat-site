import SearchButton from '@/components/SearchButton'
import { ScrollToTop } from '@/components/utils/Scroll'
import { AppState } from '@/reducers/rootReducer'
import { utils } from 'publicodes'
import React, { Suspense, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AnimatedLoader from '../../../AnimatedLoader'
import { WithEngine } from '../../../RulesProvider'
import BandeauContribuer from '../BandeauContribuer'
import DocumentationLanding from './DocumentationLanding'
import QuickDocumentationPage from './QuickDocumentationPage'

const DocumentationPageLazy = React.lazy(
	() =>
		import(/* webpackChunkName: 'DocumentationPage' */ './DocumentationPage')
)

export default function () {
	const rules = useSelector((state: AppState) => state.rules)

	//This ensures the disambiguateReference function, which awaits RuleNodes, not RawNodes, doesn't judge some rules private for
	//our parseless documentation page
	const allPublicRules = Object.fromEntries(
		Object.entries(rules).map(([key, value]) => [
			key,
			{ ...value, private: false },
		])
	)

	const { pathname: pathnameRaw } = useLocation(),
		pathname = decodeURIComponent(pathnameRaw)

	const [loadEngine, setLoadEngine] = useState(false)

	const engineState = useSelector((state) => state.engineState)
	const parsedEngineReady =
		engineState.state === 'ready' && engineState.options.parsed

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	const encodedDottedName = pathname.split('/documentation/')[1]
	const dottedName = utils.decodeRuleName(encodedDottedName)

	if (!dottedName) {
		return <Navigate to="/404" replace />
	}

	const rule = rules[dottedName] ?? {}

	return (
		<div
			css={`
				@media (min-width: 800px) {
					max-width: 80%;
				}

				margin: 0 auto;
			`}
		>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					justify-content: center;
					> * {
						margin: 0 3rem;
					}
				`}
			>
				<BackToSimulation />
				<SearchButton key={pathname} />
			</div>
			{!parsedEngineReady && !loadEngine && (
				<div>
					<QuickDocumentationPage
						rule={rule}
						dottedName={dottedName}
						setLoadEngine={setLoadEngine}
						rules={allPublicRules}
					/>
				</div>
			)}
			{(parsedEngineReady || loadEngine) && (
				<WithEngine options={{ optimized: false, parsed: true }}>
					<Suspense fallback={<AnimatedLoader />}>
						<DocumentationPageLazy dottedName={dottedName} />
					</Suspense>
				</WithEngine>
			)}

			<BandeauContribuer />
		</div>
	)
}

function BackToSimulation() {
	return (
		<Link to="/simulateur/bilan" className="ui__ simple small push-left button">
			←<Trans>Voir le test</Trans>
		</Link>
	)
}
