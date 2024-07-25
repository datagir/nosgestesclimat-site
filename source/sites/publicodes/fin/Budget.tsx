import { findContrastedTextColor } from 'Components/utils/colors'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'
import Meta from 'Components/utils/Meta'
import { motion, useSpring } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import tinygradient from 'tinygradient'
import { ActionButton, IntegratorActionButton } from './Buttons'
import ClimateTargetChart from './ClimateTargetChart'
import FinShareButton from './FinShareButton'

import { hasSubscribedToNewsletterSelector } from '@/selectors/simulationSelectors'

const gradient = tinygradient([
		'#78e08f',
		'#e1d738',
		'#f6b93b',
		'#b71540',
		'#000000',
	]),
	colors = gradient.rgb(20)

const getBackgroundColor = (score) =>
	colors[
		Math.round((score < 2000 ? 0 : score > 20000 ? 19000 : score - 2000) / 1000)
	]

export default ({
	score,
	details,
	headlessMode,
	nextSlide,
	noQuestionsLeft,
}) => {
	//	Configuration is try and test, feeling, really
	const { t } = useTranslation()

	const valueSpring = useSpring(0, {
		mass: 15,
		stiffness: 50,
		damping: 50,
	})

	const [value, setValue] = useState(0)

	useEffect(() => {
		const unsubscribe = valueSpring.onChange((v) => {
			setValue(Math.round(v))
		})

		headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	}, [score])

	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true),
		roundedValue = (value / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		})

	const { integratorYoutubeVideo, integratorActionText, integratorActionUrl } =
		useContext(IframeOptionsContext)

	const hasSubscribedToNewsletter = useSelector(
		hasSubscribedToNewsletterSelector,
	)

	return (
		<div
			css={`
				width: 100%;
			`}
		>
			<Meta
				title={t('Mon empreinte climat')}
				description={t('meta.publicodes.fin.Budget.description', {
					roundedValue,
				})}
				url={window.location}
			/>
			<motion.div
				animate={{ scale: [0.9, 1] }}
				transition={{ duration: headlessMode ? 0 : 0.6 }}
				className=""
				id="fin"
				css={`
					background: ${backgroundColor};
					background: linear-gradient(
						180deg,
						${backgroundColor} 0%,
						${backgroundColor2} 100%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
					width: 100%;
				`}
			>
				<div id="shareImage" css="padding: 2rem 0 .6rem;">
					<ClimateTargetChart
						value={value}
						details={details}
						color={textColor}
						noAnimation
						noText
						score={score}
						nextSlide={nextSlide}
					/>
				</div>
				<div
					css={`
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						margin: 1rem 0;
						gap: 1rem;
					`}
				>
					{!hasSubscribedToNewsletter && (
						<button
							onClick={() => {
								document
									.getElementById('newsletter-form-container')
									?.scrollIntoView({
										behavior: 'smooth',
									})
							}}
							css={`
								font-size: 1rem !important;
								display: flex !important;
								align-items: center;
								padding: 0rem 1rem !important;
								background-image: linear-gradient(
									50deg,
									var(--darkestColor) -50%,
									var(--color) 30%
								);
								color: white;
								border-radius: 0.6rem;
								text-transform: inherit !important;
								@media (max-width: 340px) {
								}
								padding: 0.875rem 1rem !important;
							`}
							className="ui__ plain button"
						>
							<span
								role="img"
								aria-label="Emoji save"
								css={`
									font-size: 1.25rem;
									display: inline-block;
									margin-right: 0.4rem;
									@media (max-width: 340px) {
										font-size: 0.875rem;
									}
								`}
							>
								📩
							</span>
							{t('Sauvegarder mes résultats')}
						</button>
					)}

					{noQuestionsLeft && (
						<FinShareButton
							label={t(
								hasSubscribedToNewsletter
									? 'Partager mes résultats'
									: 'Partager',
							)}
							textColor={textColor}
						/>
					)}
				</div>

				{integratorActionText && integratorActionUrl && (
					<IntegratorActionButton />
				)}

				{integratorYoutubeVideo && (
					<div
						className="videoWrapper"
						css={`
							iframe {
								width: 100%;
							}
						`}
					>
						<iframe
							width="560"
							height="315"
							src={integratorYoutubeVideo}
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				)}

				{integratorActionText && (
					<ActionButton text={t('Réduire mon empreinte')} />
				)}
			</motion.div>
		</div>
	)
}
