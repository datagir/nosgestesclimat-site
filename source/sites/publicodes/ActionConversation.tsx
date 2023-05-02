import { setSimulationConfig } from 'Actions/actions'
import Simulation from 'Components/Simulation'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { questionConfig } from './questionConfig'

export default ({ dottedName }) => {
	const { t } = useTranslation()
	const nextQuestions = useNextQuestions()
	const configSet = useSelector((state) => state.simulation?.config)

	// TODO here we need to apply a rustine to accommodate for this issue
	// https://github.com/betagouv/mon-entreprise/issues/1316#issuecomment-758833973
	// to be continued...
	const config = {
		objectifs: [dottedName],
		situation: { ...(configSet?.situation || {}) },
		questions: questionConfig,
	}

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [dottedName])
	if (!configSet) return null

	return nextQuestions.length > 0 ? (
		<>
			<h2>{t('Veuillez répondre aux questions suivantes pour continuer :')}</h2>
			<Simulation
				showConversation
				customEnd={<div />}
				targets={<div />}
				explanations={null}
				animation="fromBottom"
				questionHeadingLevel="3"
			/>
		</>
	) : null
}
