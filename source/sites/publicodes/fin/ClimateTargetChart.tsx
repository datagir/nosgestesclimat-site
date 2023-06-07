import NeutralH1 from 'Components/ui/NeutralH1'
import { AnimatePresence, motion } from 'framer-motion'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { extractCategories } from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'

import { relegateCommonCategories } from 'Components/publicodesUtils'
import { useLayoutEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import SafeCategoryImage from '../../../components/SafeCategoryImage'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'

export const sustainableLifeGoal = 2000 // kgCO2e
const sustainableBackground = '#78e08f'
const barWidth = '6rem'

const computeEmpreinteMaximum = (categories) =>
	categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

const formatValue = (value: number, _abrvLocale: string) =>
	// NOTE: we use the french locale for the thousands separator because otherwise
	// the number is not printed correctly.
	(value / 1000).toLocaleString('fr-FR', {
		maximumSignificantDigits: 2,
		minimumSignificantDigits: 2,
	})

export default ({ details, color, value, score, nextSlide }) => {
	const { i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const sortedCategories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abréviation,
		})
	)
	const categories = relegateCommonCategories(sortedCategories)

	if (!categories) return null

	const empreinteTotale = categories.reduce(
		(memo, next) => next.nodeValue + memo,
		0
	)
	const roundedValue = formatValue(value, currentLangInfos.abrvLocale),
		integerValue = roundedValue.split(',')[0],
		decimalValue = roundedValue.split(',')[1]

	const invertWhiteArrows = color.includes('#000000') ? 'filter: invert(1)' : ''

	// This could be tweaked, I've set it to 3 tonnes by default
	// When the green bar is relatively high, we don't have enough room for the labels
	const lowTotal = empreinteTotale < 3000,
		targetAchieved = empreinteTotale < 2000

	// We need to compute the real size of the personal bar, to display the correct size for the relative sustainable bar
	const ref = useRef(null)

	const [height, setHeight] = useState(0)

	useLayoutEffect(() => {
		setHeight(ref.current.offsetHeight)
	}, [])
	const sustainableBarHeight = (sustainableLifeGoal / empreinteTotale) * height

	const { t } = useTranslation()

	return (
		<section
			css={`
				position: relative;
				display: flex;
				justify-content: space-evenly;
				align-items: flex-end;
				height: 360px;
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				strong {
					font-weight: 600;
				}
				padding: 0;
			`}
		>
			<div
				css={`
					bottom: ${sustainableBarHeight}px;
					left: 50%;
					position: absolute;
					border-bottom: 6px dashed ${color};
					height: 0.1rem;
					width: 80%;
					transform: translateX(-50%);
				`}
			/>
			<div
				css={`
					z-index: 1;
					height: 100%;
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
				`}
			>
				<div
					css={`
						position: absolute;
						right: 5vw;
						top: 0rem;
						margin-bottom: 1.4rem;
						background: #ffffff26;
						border-radius: 0.6rem;
						margin: 0 0.6rem;
						padding: 0rem 0.6rem;
						width: 10rem;
					`}
				>
					<div css="margin: .4rem 0; font-style: italic;">
						<NeutralH1 id="myFootprint">
							<Trans>mon empreinte annuelle</Trans>
						</NeutralH1>
						<img
							src="/images/thin-arrow-left.svg"
							aria-hidden
							title="Comprendre l'objectif à atteindre"
							css={`
								height: 3rem;
								position: absolute;
								left: -2rem;
								bottom: -3.4rem;
								${invertWhiteArrows}
							`}
						/>
					</div>
				</div>
				<div
					css=" height: 3rem"
					title={t('{{res}} tonnes de CO₂e', {
						res: formatValue(score, currentLangInfos.abrvLocale),
					})}
					aria-describedby="myFootprint"
				>
					<div
						css={`
							width: 4rem;
							text-align: right;
							display: inline-block;
							font-weight: bold;
							font-size: 280%;
						`}
					>
						{integerValue}
						{score < 10000 && (
							<AnimatePresence>
								{(score - value) / score < 0.01 && (
									<motion.small
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: 'auto' }}
										css={`
											color: inherit;
											font-size: 60%;
										`}
									>
										,{decimalValue}
									</motion.small>
								)}
							</AnimatePresence>
						)}
					</div>{' '}
					<span css="font-size: 160%; ">tonnes</span>
				</div>
				<div ref={ref} css="height: calc(100% - 3rem)">
					<CategoriesBar
						{...{
							categories,
							color,
							empreinteTotale,
							onCategoryClick: nextSlide,
						}}
					/>
				</div>
			</div>
			<div css="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; flex-wrap: wrap; width: 50%; height: 100%">
				{!lowTotal && (
					<>
						<div
							css={`
								background: #ffffff26;
								border-radius: 0.6rem;
								margin: 0 0.6rem;
								padding: 0.4rem 1rem;
								margin-bottom: 1rem;
								position: relative;
							`}
						>
							<div id="objective">
								<Trans>mon objectif</Trans>
								<ObjectiveExplanation />
							</div>
							<img
								src="/images/thin-arrow-left.svg"
								title={t("Comprendre l'objectif à atteindre")}
								aria-hidden
								css={`
									height: 3rem;
									position: absolute;
									right: -1rem;
									bottom: -3.4rem;

									transform: rotate(-30deg) scale(0.8);
									${invertWhiteArrows}
								`}
							/>
						</div>
						<div
							css={`
								margin-bottom: 0.6rem;
								strong {
									font-size: 280%;
									margin-right: 0.3rem;
								}
								span {
									font-size: 160%;
								}
							`}
							aria-describedby="objective"
						>
							<strong>{sustainableLifeGoal / 1000}</strong>
							<span>
								<Trans>tonnes</Trans>
							</span>
						</div>
					</>
				)}
				<div
					css={`
						${barBorderStyle(color)}

						background: ${sustainableBackground};
						height: ${sustainableBarHeight}px;
						width: ${barWidth};

						display: flex;
						flex-direction: column;
						justify-content: center;
						font-size: 200%;
					`}
					title={t("L'objectif à atteindre, 2 tonnes de CO₂e")}
				>
					{emoji('🎯')}
				</div>
			</div>

			{!targetAchieved && (
				<div
					css={`
						height: 0.3rem;
						background: ${color};
						width: 80%;
						position: absolute;
						bottom: 0;
						z-index: 10;
					`}
				/>
			)}
		</section>
	)
}

const borderRadius = '.3rem'
const barBorderStyle = (color) => `
	border-radius: ${borderRadius};
	border: 4px solid ${color};
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
`

const CategoriesBar = ({
	categories,
	empreinteTotale,
	color,
	onCategoryClick,
}) => {
	const { t } = useTranslation()
	return (
		<ol
			css={`
				margin: 0;
				width: ${barWidth};
				height: 100%;
				padding: 0;
				${barBorderStyle(color)}
				cursor: pointer;
				:hover {
					border-color: var(--lightColor);
				}
			`}
			onClick={onCategoryClick}
			title={t('Explorer les catégories')}
		>
			{categories.map((category, index) => (
				<li
					key={category.title}
					title={`${category.title} : ${Math.round(
						(category.nodeValue / empreinteTotale) * 100
					)}%`}
					css={`
						margin: 0;
						list-style-type: none;
						background: ${category.color};
						height: ${(category.nodeValue / empreinteTotale) * 100}%;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							font-size: 120%;
						}
						@media (min-height: 800px) {
							img {
								font-size: 180%;
							}
						}
						${index < categories.length - 1 &&
						`
					border-bottom: 4px solid ${color};

					padding: 0;
					`}
					`}
				>
					{category.nodeValue / empreinteTotale > 0.1 ? (
						<SafeCategoryImage element={category} />
					) : (
						''
					)}
				</li>
			))}
		</ol>
	)
}

export const ObjectiveExplanation = () => {
	const { t } = useTranslation()
	return (
		<a
			css="color: inherit"
			href="https://ecolab.ademe.fr/blog/général/budget-empreinte-carbone-c-est-quoi.md"
			target="_blank"
			title={t("Comprendre l'ojectif de 2 tonnes")}
		>
			<img
				src="/images/info.svg"
				aira-hidden
				css={`
					width: 1.5rem;
					vertical-align: middle;
					margin-left: 0.2rem;
				`}
			/>
		</a>
	)
}
