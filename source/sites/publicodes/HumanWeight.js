import { Trans, useTranslation } from 'react-i18next'

import { correctValue } from '../../components/publicodesUtils'
import { getCurrentLangInfos } from '../../locales/translation'
import { disabledAction, supersededAction } from './ActionVignette'

export const humanWeight = (
	{ t, i18n }, // We need to be passed as an argument instead of calling useTranslation inside the body, to avoid 'Rendered more hooks than during the previous render.'
	possiblyNegativeValue,
	concise = false,
	noSign
) => {
	const v = Math.abs(possiblyNegativeValue)
	const [raw, unit, digits] =
		v === 0
			? [v, '', 0]
			: v < 1
			? [v * 1000, 'g', 1]
			: v < 1000
			? [v, 'kg', 0]
			: [v / 1000, concise ? 't' : v > 2000 ? t('tonnes') : t('tonne'), 1]

	const abrvLocale = getCurrentLangInfos(i18n).abrvLocale

	const signedValue = raw * (possiblyNegativeValue < 0 ? -1 : 1),
		resultValue = noSign ? raw : signedValue,
		value = resultValue.toLocaleString(abrvLocale, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits,
		})

	return [value, unit]
}

const HumanWeight = ({
	nodeValue,
	overrideValue,
	metric = 'climat',
	unitText: givenUnitText,
	longUnitText,
}) => {
	const { t, i18n } = useTranslation()
	const unitText = givenUnitText || (
		<span>
			<Trans i18nKey="humanWeight.unitSuffix">de</Trans> CO₂-e /{' '}
			{t('an', { ns: 'units' })}
		</span>
	)

	const [value, unit] =
		metric === 'climat'
			? humanWeight({ t, i18n }, nodeValue)
			: metric === 'pétrole'
			? [nodeValue, '']
			: [null]

	if (value == null) return null
	return (
		<span
			css={`
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				del {
					color: var(--lightColor2);
					font-weight: normal;
					text-decoration: none;
					position: relative;
				}
				del::after {
					content: '';
					position: absolute;
					top: 50%;
					left: 0;
					width: 100%;
					height: 1px;
					background: var(--lightColor2);
					transform: rotate(-7deg);
				}
				ins {
					text-decoration: none;
				}
			`}
		>
			<strong
				role="status"
				className="humanvalue"
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				<span>
					{overrideValue ? (
						<>
							<del css="">{value}</del>
							&nbsp;
							<ins>
								{humanWeight({ t, i18n }, nodeValue - overrideValue)[0]}
							</ins>
						</>
					) : (
						value
					)}
				</span>
				<span>&nbsp;{unit}</span>
			</strong>{' '}
			<span>
				<span
					className="unitSuffix"
					css={
						longUnitText &&
						`
						@media (min-width: 800px) {
							display: none;
						}
					`
					}
				>
					{unitText}
				</span>
				{longUnitText && (
					<span
						className="unitSuffix"
						css={`
							@media (max-width: 800px) {
								display: none;
							}
						`}
					>
						{longUnitText}
					</span>
				)}
			</span>
		</span>
	)
}

export const DiffHumanWeight = ({
	nodeValue,
	engine,
	rules,
	actionChoices,
	metric,
	unitSuffix,
}) => {
	// Here we compute the sum of all the actions the user has chosen
	// we could also use publicode's 'actions' variable sum,
	// but each action would need to have a "chosen" question,
	// and disactivation rules

	const actions = rules['actions'].formule.somme.map((dottedName) =>
			engine.evaluate(dottedName)
		),
		actionTotal = actions.reduce((memo, action) => {
			const correctedValue = correctValue({
				nodeValue: action.nodeValue,
				unit: action.unit,
			})
			if (
				correctedValue &&
				actionChoices[action.dottedName] &&
				!supersededAction(action.dottedName, rules, actionChoices) &&
				!disabledAction(rules[action.dottedName], action.nodeValue)
			) {
				return memo + correctedValue || 0
			} else return memo
		}, 0)

	return (
		<HumanWeight
			nodeValue={nodeValue}
			overrideValue={actionTotal !== 0 && actionTotal}
			metric={metric}
			unitSuffix={unitSuffix}
		/>
	)
}

export default HumanWeight
