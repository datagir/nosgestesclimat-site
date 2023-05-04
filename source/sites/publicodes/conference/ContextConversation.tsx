import 'Components/conversation/conversation.css'
import RuleInput from 'Components/conversation/RuleInput'
import { splitName } from 'Components/publicodesUtils'
import Engine from 'publicodes'
import { createContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getNextQuestions } from '../../../hooks/useNextQuestion'
import { contextURL } from './useDatabase'

const SituationContext = createContext({})

export default ({ surveyContext, setSurveyContext }) => {
	const survey = useSelector((state) => state.survey)
	const surveyRule = survey['contextFile']

	const contextFileURL = `${contextURL}/${surveyRule}.yaml`
	const yaml = require('yaml')

	const dispatch = useDispatch()

	useEffect(() => {
		fetch(contextFileURL)
			.then((response) => response.text())
			.then((text) =>
				dispatch({ type: 'ADD_CONTEXT_RULES', contextRules: yaml.parse(text) })
			)
			.catch((error) => console.log('error:', error))
	}, [contextFileURL])

	const contextRules = survey?.contextRules
	// we evaluate missing variable related to context parent rule and we pass it to getNextQuestion with a specific engine.
	const engine = new Engine(contextRules)
	const [situation, setSituation] = useState(surveyContext[survey.room])
	const missingVariables =
		contextRules && engine.evaluate(surveyRule).missingVariables
	const nextQuestions = getNextQuestions(
		[missingVariables],
		{},
		[],
		situation,
		engine
	)
	return (
		<div className="ui__ container" css={``}>
			<SituationContext.Provider value={[situation, setSituation]}>
				<Main
					nextQuestions={nextQuestions}
					engine={engine}
					situation={situation}
					setSituation={setSituation}
					surveyContext={surveyContext}
					setSurveyContext={setSurveyContext}
					room={survey.room}
				/>
			</SituationContext.Provider>
		</div>
	)
}

const Main = ({
	nextQuestions,
	engine,
	situation,
	setSituation,
	surveyContext,
	setSurveyContext,
	room,
}) => (
	<main>
		<h2
			css={`
				margin-top: 1rem;
			`}
		>
			<Trans>📝 Contexte sondage</Trans>
		</h2>
		{Object.keys(surveyContext[room]).length !== 0 ? (
			<SituationDetails
				surveyContext={surveyContext}
				setSurveyContext={setSurveyContext}
				room={room}
				situation={situation}
				setSituation={setSituation}
			/>
		) : (
			<div>
				<Questions
					nextQuestions={nextQuestions}
					engine={engine}
					situation={situation}
					setSituation={setSituation}
				/>
				<button
					className="ui__ plain button"
					disabled={!nextQuestions.every((names) => situation[names])}
					onClick={() => {
						setSurveyContext({ ...surveyContext, [room]: situation })
					}}
					css={`
						margin-bottom: 2rem;
						margin-right: 1rem;
						float: right;
					`}
				>
					<span className="text">
						<Trans>Confirmer</Trans> ✔
					</span>
				</button>
			</div>
		)}
	</main>
)

const Questions = ({ nextQuestions, engine, situation, setSituation }) => {
	const questions = nextQuestions

	const onChange = (dottedName) => (value) => {
			const newSituation = (situation) => ({
				...situation,
				[dottedName]: value,
			})
			setSituation((situation) => newSituation(situation))
		},
		onSubmit = () => null

	return (
		<div
			css={`
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 10px;
				@media (max-width: 800px) {
					grid-template-columns: repeat(1, 1fr);
				}
				margin: 1rem 0;
				.step.input {
					max-width: 12rem;
				}
			`}
		>
			{questions.map((dottedName) => {
				const { question } = engine.getRule(dottedName).rawNode
				return (
					<div
						css={`
							display: flex;
							justify-content: start;
							align-items: flex-start;
							margin: 0 0.25rem 0rem 0.25rem;
							font-size: 85%;
							span {
								font-size: 85%;
							}
							img {
								font-size: 300%;
								margin-right: 1rem;
							}
							@media (max-width: 800px) {
								img {
									font-size: 200%;
									margin-right: 0.4rem;
								}
							}
						`}
					>
						<label>
							<p>{question}</p>
							<RuleInput
								{...{
									engine,
									dottedName,
									onChange: onChange(dottedName),
									onSubmit,
									noSuggestions: false,
								}}
							/>
						</label>
					</div>
				)
			})}
		</div>
	)
}

const SituationDetails = ({
	surveyContext,
	setSurveyContext,
	room,
	situation,
	setSituation,
}) => {
	return (
		<details
			className="ui__ card plain"
			css={`
				margin-bottom: 2rem;
				width: 100%;
				opacity: 0.9;
			`}
		>
			<summary>Mon profil</summary>
			<ul css="text-transform: capitalize">
				{Object.entries(situation).map(([k, v]) => (
					<li key={k}>{`${splitName(k)[1]} : ${v?.nodeValue || v}`}</li>
				))}
			</ul>
			<div css="text-align: center">
				<button
					className="ui__ simple small button"
					css={`
						margin-bottom: 1rem;
						background: white !important;
						padding: 0.5rem !important;
					`}
					onClick={() => {
						setSituation({})
						setSurveyContext({ ...surveyContext, [room]: {} })
					}}
				>
					<span className="text">
						<Trans>Modifier</Trans> →
					</span>
				</button>
			</div>
		</details>
	)
}
