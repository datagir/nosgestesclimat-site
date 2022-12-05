import Engine from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import HumanWeight from './HumanWeight'

const demoDottedNames = [
	'intensité électricité',
	'transport . voiture . thermique . empreinte au litre',
	"logement . construction . durée d'amortissement",
]

const indicatorsKeys = ['bilan', 'transport . empreinte', 'logement']
export default () => {
	const [situation, setSituation] = useState({})
	const rules = useSelector((state) => state.rules)
	const engine = useMemo(() => {
		return new Engine(rules)
	}, [rules])

	const [indicators, setIndicators] = useState(
		Object.fromEntries(indicatorsKeys.map((el) => [el, null]))
	)

	useEffect(() => {
		engine.setSituation(situation)
		setIndicators(
			Object.fromEntries(
				indicatorsKeys.map((indicator) => [
					indicator,
					engine.evaluate(indicator).nodeValue,
				])
			)
		)
	}, [situation])

	console.log(situation, indicators)

	const onChange = (dottedName, value) =>
		setSituation({ ...situation, [dottedName]: value })

	return (
		<div css="margin: 1rem 0; padding: .6rem;  background: var(--lighterColor)">
			<ul>
				{demoDottedNames.map((el) => (
					<li key={el}>
						<label>
							{el}{' '}
							<input
								type="number"
								value={situation[el]}
								onChange={(e) =>
									onChange(el, e.target.value === '' ? null : e.target.value)
								}
							/>
							&nbsp;{rules[el].unité}
						</label>
					</li>
				))}
			</ul>

			<div>
				<HumanWeight nodeValue={indicators.bilan || 9} />
				<small css="margin: 0 auto; display: block; text-align: center">
					Dont {Math.round(indicators['transport . empreinte'])} kgCO2e de
					transport et {Math.round(indicators.logement)} kgCO2e de logement.
				</small>
			</div>
			{/* TODO would be cool, but doesn't work with this new aside Engine 
			<InlineCategoryChart givenEngine={engine} />
			*/}
		</div>
	)
}