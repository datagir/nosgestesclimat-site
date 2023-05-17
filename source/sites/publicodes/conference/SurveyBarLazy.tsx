// TODO: factorizable with ConferenceBarLazy

import React, { Suspense } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { WithEngine } from '../../../RulesProvider'

const SurveyBar = React.lazy(
	() => import(/* webpackChunkName: 'SurveyBar' */ './SurveyBar')
)

export default () => {
	const survey = useSelector((state) => state.survey)
	if (!survey) {
		return null
	}

	return (
		<Suspense
			fallback={
				<div>
					<Trans>Chargement</Trans>
				</div>
			}
		>
			<WithEngine>
				<SurveyBar />
			</WithEngine>
		</Suspense>
	)
}
