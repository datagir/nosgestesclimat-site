import Meta from 'Components/utils/Meta'
import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'
import ActionTeaser from './ActionTeaser'
import { ActionButton } from './Buttons'

export default ({ score, headlessMode }) => {
	//	Configuration is try and test, feeling, really
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const valueSpring = useSpring(0, {
		mass: 10,
		stiffness: 50,
		damping: 60,
	})

	const [value, setValue] = useState(0)

	useEffect(() => {
		const unsubscribe = valueSpring.onChange((v) => {
			setValue(v)
		})

		true || headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	}, [])

	const backgroundColor = 'var(--lightColor)',
		backgroundColor2 = 'var(--lighterColor)',
		textColor = 'var(--darkerColor)',
		roundedValue = (value / 1000).toLocaleString(currentLangInfos.abrvLocale, {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		})

	return (
		<div>
			<Meta
				title={t('Nosgestesclimat - le top 3 de mes actions')}
				description={t('meta.publicodes.fin.actionslide.description', {
					roundedValue: roundedValue,
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
						${backgroundColor} -50%,
						${backgroundColor2} 60%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
					h1 {
						font-size: 130%;
						margin: 0.6rem;
					}
				`}
			>
				<h1>
					<Trans>Comment réduire mon empreinte ?</Trans>
				</h1>
				<p
					css={`
						font-style: italic;
					`}
				>
					{' '}
					<Trans>Les 3 actions au plus fort impact pour vous :</Trans>
				</p>
				<div id="shareImage" css="padding: 0">
					<div css="padding: 0 1rem">
						<ActionTeaser />
					</div>
				</div>

				<ActionButton text={t('Voir toutes les actions')} score={score} />
			</motion.div>
		</div>
	)
}
