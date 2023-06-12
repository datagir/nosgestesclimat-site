import { updateSituation } from 'Actions/actions'
import Checkbox from 'Components/ui/Checkbox'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import MosaicInputSuggestions from '../MosaicInputSuggestions'
import MosaicStamp from './MosaicStamp'
import { Mosaic, MosaicItemLabel, mosaicLabelStyle } from './UI'

const MosaicLabelDiv = styled.div`
	${mosaicLabelStyle}
`

export default function SelectDevices({
	dottedName,
	selectedRules,
	suggestions,
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

	const relatedRuleNames = selectedRules.reduce(
		(memo, arr) => [...memo, arr[1].dottedName],
		[]
	)

	// for now, if nothing is checked, after having check something, 'suivant' button will have same effect as 'je ne sais pas'
	// we can imagine a useeffect that set to 0 situation of dottedname every time all card are unchecked (after user checked something at least once)

	return (
		<div>
			<MosaicInputSuggestions
				mosaicType="selection"
				dottedName={dottedName}
				relatedRuleNames={relatedRuleNames}
				suggestions={suggestions}
			/>
			<Mosaic>
				{selectedRules.map(
					([
						{
							dottedName: name,
							title,
							rawNode: { description, icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName],
							value =
								situationValue != null
									? situationValue
									: // unlike the NumberedMosaic, we don't preselect cards choices here
									  // user tests showed us it is now well received
									  'non',
							isNotActive = 'inactif' in question.rawNode
						return (
							<li
								className={
									isNotActive
										? 'ui__ card interactive inactive'
										: `ui__ card interactive transparent-border ${
												value === 'oui' ? 'selected' : ''
										  }`
								}
								key={name}
							>
								<MosaicItemLabel
									question={question}
									title={title}
									icônes={icônes}
									description={false}
									isNotActive={isNotActive}
								/>
								{!isNotActive && (
									<div
										css={`
											font-size: 1.8rem;
											pointer-events: auto;
										`}
									>
										<Checkbox
											name={name}
											id={name}
											label={title}
											checked={value === 'oui'}
											onChange={() =>
												dispatch(
													updateSituation(
														question.dottedName,
														value == 'oui' ? 'non' : 'oui'
													)
												)
											}
										/>
									</div>
								)}
								{isNotActive && (
									<MosaicStamp>
										<Trans>Bientôt disponible !</Trans>
									</MosaicStamp>
								)}
							</li>
						)
					}
				)}
			</Mosaic>
		</div>
	)
}
