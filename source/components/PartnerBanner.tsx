import { useTranslation } from 'react-i18next'

export default () => {
	const { t } = useTranslation()
	return (
		<div
			css={`
				margin: 1rem;
				text-align: center;
				a {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				span {
					margin-bottom: 0.6rem;
					max-width: 10rem;
					line-height: 1.3rem;
				}
			`}
		>
			<a
				href="https://www.jeveuxaider.gouv.fr/engagement/printemps-pour-la-planete/"
				title={t(
					'Découvrez les actions de la campagne Printemps pour la planète'
				)}
				target="_blank"
			>
				<span>Rejoignez le mouvement</span>
				<img
					alt={t(
						'Le logo vert et bleu de la campagne Printemps pour la planète'
					)}
					src="/images/Printemps-pour-la-planete.svg"
					width="100"
					height="100"
					css="width: 15vh; "
				/>
			</a>
		</div>
	)
}
