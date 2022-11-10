import { motion } from 'framer-motion'
import { Trans } from 'react-i18next'
import TriangleShape from '../sites/publicodes/chart/TriangleShape'
import DefaultFootprint from '../sites/publicodes/DefaultFootprint'

export default ({ openExplanation, setOpenExplanation }) => {
	return (
		openExplanation && (
			<motion.div
				positionTransition
				initial={{ opacity: 0, y: 50, scale: 0.3 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
				css={`
					@media (max-width: 800px) {
						max-height: 15rem;
						position: fixed;
						top: auto;
						bottom: 15rem;
						margin-left: 0.5rem;
						margin-right: 0.5rem;
					}
				`}
			>
				<div
					css={`
						height: 1.9rem;
						svg {
							width: 2rem;
							height: auto;

							transform: rotate(180deg);
							@media (max-width: 799px) {
								display: none;
							}
						}
					`}
				>
					<TriangleShape color="var(--color)" />
				</div>
				<div
					className="ui__ card"
					css={`
						position: relative;
						border: 0.4rem solid var(--color) !important;
						padding: 1.8rem 1.2rem 0.5rem 1.5rem;
					`}
				>
					<p
						css={`
							font-size: 90% !important;
							text-align: left !important;
							color: var(--darkColor) !important;
							line-height: 1.1rem;
							> a {
								text-decoration: underline !important;
							}
						`}
					>
						➡️
						<Trans i18nKey={'components.ScoreExplanation.text'}>
							<DefaultFootprint /> de CO2-e par an, c'est{' '}
							<b>un point de départ théorique</b> calculé à partir de valeurs
							par défaut attribuées à l'avance à chaque question. Au fur et à
							mesure de vos réponses, vous{' '}
							<b>personnalisez votre score selon votre mode de vie</b>. Si vous
							répondez "je ne sais pas" à une question, vous remarquerez que le
							total ne change pas puisqu'une valeur standard vous est attribuée
							dans ce cas. Il est fréquent que le score initial change car
							<a href="https://nosgestesclimat.fr/nouveaut%C3%A9s/">
								le modèle Nos Gestes Climat évolue
							</a>
							!
						</Trans>
					</p>
					<button
						onClick={() => setOpenExplanation(false)}
						css={`
							border: none;
							font-size: 200%;
							color: var(--color);
							position: absolute;
							right: 0.6rem;
							top: 0.3rem;
							padding: 0;
						`}
						title="Fermer la notification d'explication"
					>
						&times;
					</button>
					<div
						css={`
							display: flex;
							justify-content: flex-end;
						`}
					>
						<button
							className="ui__ button plain small"
							onClick={() => setOpenExplanation(false)}
							css={`
								font-size: 80% !important;
								padding: 0.3rem !important;
							`}
						>
							<Trans>J'ai compris</Trans>
						</button>
					</div>
				</div>
				<div
					css={`
						svg {
							width: 2rem;
							height: auto;
							margin-top: -0.2rem;
							@media (min-width: 800px) {
								display: none;
							}
						}
					`}
				>
					<TriangleShape color="var(--color)" />
				</div>
			</motion.div>
		)
	)
}
