import { skipTutorial } from '@/actions/actions'
import { matomoEventParcoursTestSkipTutorial } from '@/analytics/matomo-events'
import { Twemoji } from '@/components/emoji'
import ButtonLink from '@/components/groupe/ButtonLink'
import Title from '@/components/groupe/Title'
import { MODEL_ROOT_RULE_NAME } from '@/components/publicodesUtils'

import Meta from '@/components/utils/Meta'
import { useMatomo } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import { AppState } from '@/reducers/rootReducer'
import { generateImageLink } from '@/sites/publicodes/fin'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import Chart from '@/sites/publicodes/chart'
import CO2e from 'Images/co2e.svg'
import GreenhouseEffect from 'Images/greenhouse-effect.svg'
import { WithEngine } from '../../RulesProvider'

export default function Tutoriel() {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const urlParams = new URLSearchParams(window.location.search)

	const fromRuleURLParam = urlParams.get('fromRuleURL')

	const targetUrl = fromRuleURLParam
		? fromRuleURLParam
		: `/simulateur/${MODEL_ROOT_RULE_NAME}`

	if (fromRuleURLParam) {
		// The tutorial is skipped when redirected from a specific rule URL
		// (e.g. /simulateur/bilan/logement/chauffage)
		// [tutorials.fromRule = 'skip']
		dispatch(skipTutorial('testIntro', false, 'skip'))
		return <Navigate to={targetUrl} replace />
	}

	const tutorials = useSelector((state: AppState) => state.tutorials)

	const { trackEvent } = useMatomo()

	const skip = (name: string, unskip = false) =>
		dispatch(
			skipTutorial(
				name,
				unskip,
				tutorials.fromRule == 'skip'
					? // Returning to 'simulateur/bilan' after skipping the tutorial from a
					  // specific rule URL
					  'done'
					: tutorials.fromRule
			)
		)

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	return (
		<>
			<main className="p-4  h-full ">
				<Meta
					title={t('Tutoriel')}
					description={t(
						'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'
					)}
					image={generateImageLink(window.location)}
				/>
				<Title
					data-cypress-id="tutoriel-title"
					title={
						<span className="">
							<span className="text-secondary inline">
								<Trans>10 minutes</Trans>
							</span>{' '}
							<Trans>chrono pour calculer votre empreinte sur le climat</Trans>
						</span>
					}
				/>
				<div className="bg-grey-100 p-7 relative mt-14">
					<div
						role="presentation"
						aria-hidden
						className="absolute -top-8 p-4 bg-grey-100 rounded-full inline-block text-3xl"
					>
						<Twemoji text="💡"></Twemoji>
					</div>
					<h3>
						<Trans>Avant de commencer</Trans>
					</h3>
					<div className="relative pl-8">
						<h4 className="font-bold before:content-['🏡'] before:absolute before:left-0 overflow-visible ">
							<Trans>C'est un test individuel !</Trans>
						</h4>
						<p>
							<Trans>
								Répondez aux questions en votre nom, pas pour votre foyer. Bien
								sûr, certaines choses sont partagées (au sein de mon logement
								avec ma famille, la voiture avec les covoitureurs) : cela sera
								bien pris en compte dans le calcul de votre empreinte carbone,
								ne vous inquiétez pas !
							</Trans>
						</p>
					</div>
					<div className="relative pl-8">
						<h4 className="font-bold before:content-['👤'] before:absolute before:left-0 overflow-visible ">
							<Trans>
								Il concerne votre vie personnelle, et non pas votre boulot.
							</Trans>
						</h4>
					</div>
				</div>
				<h5 className="mt-10 text-lg">D’autres questions ?</h5>
				<ul className="list-none p-0 mb-1">
					<li className="my-1" id={'empreinte'}>
						<details>
							<summary className=" font-bold text-primary">
								<Trans>C’est quoi mon empreinte carbone ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<Trans i18nKey={'publicodes.Tutoriel.slide1.p1'}>
									<p>
										Le climat se réchauffe à cause des activités humaines, c'est
										un fait. Tout ce que nous consommons, utilisons, puis jetons
										a nécessité de la matière et de l'énergie. Que ce soit pour
										la phase de production, d'utilisation, ou de fin de vie du
										bien, ou du service. Ainsi, toutes nos activités participent
										à émettre des gaz à effet de serre. Certaines énormément,
										d'autres très peu. Mais quel est notre impact, à notre
										échelle de citoyen ?
									</p>
								</Trans>
								<GreenhouseEffect css="width: 60%; max-height: 20rem; margin: 0 auto 1rem; display: block;" />
								<Trans i18nKey={'publicodes.Tutoriel.slide1.p2'}>
									<p>
										Pour estimer sa propre contribution au réchauffement de la
										planète (son "impact climat"), il est d'usage de calculer ce
										qu'on appelle l'empreinte carbone individuelle de
										consommation.
									</p>
								</Trans>
							</div>
						</details>
					</li>
					<li className="my-1" id={'mesure'}>
						<details>
							<summary className=" font-bold text-primary">
								<Trans>Comment on la mesure ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<p>
									<Trans i18nKey={'publicodes.Tutoriel.slide2.p1'}>
										Avec une unité au nom barbare : l'équivalent CO₂. Le dioxyde
										de carbone
										<img
											alt=""
											src="/images/co2.svg"
											css={`
												object-fit: cover;
												vertical-align: middle;
												width: 3.5rem;
												height: 1.7rem;
											`}
										/>
										, vous le connaissez : on l'expire toute la journée, mais
										sans influence sur le climat.
									</Trans>
								</p>
								<div
									aria-hidden="true"
									css={`
										svg {
											height: 7rem;
											margin: 0.6rem auto;
											display: block;
											animation: fall 0.5s ease-in;
										}

										@keyframes fall {
											from {
												transform: translateY(-100%);
												opacity: 0;
											}
											80% {
												transform: translateY(10%);
												opacity: 1;
											}
											100% {
												transform: translateY(0%);
												opacity: 1;
											}
										}

										svg text {
											mask-size: 200%;

											mask-image: linear-gradient(
												-75deg,
												rgba(0, 0, 0, 0.6) 30%,
												#000 50%,
												rgba(0, 0, 0, 0.6) 70%
											);
											mask-size: 200%;
											animation: shine 2s linear infinite;

											@keyframes shine {
												from {
													-webkit-mask-position: 150%;
												}
												to {
													-webkit-mask-position: -50%;
												}
											}
										}
									`}
								>
									<CO2e />
								</div>
								<p>
									<Trans i18nKey={'publicodes.Tutoriel.slide2.p2'}>
										Ce sont les machines qui font notre confort moderne qui en
										rejettent massivement, à tel point qu'on le compte en
										milliers de kilos par an et par personne, donc en{' '}
										<strong>tonnes</strong> de CO₂e !
									</Trans>
								</p>
								<blockquote>
									<details>
										<summary>
											<Trans i18nKey={'sites.publicodes.Tutorial.questionE'}>
												💡 Mais que veut dire ce petit <em>e</em> ?
											</Trans>
										</summary>{' '}
										<Trans i18nKey={'publicodes.Tutoriel.slide2.blockquote'}>
											D'autres gaz, surtout le méthane{' '}
											<img
												alt=""
												src="/images/methane.svg"
												css="width: 1.8rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
											/>{' '}
											et le protoxyde d'azote{' '}
											<img
												alt=""
												src="/images/n2o.svg"
												css="width: 3rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
											/>{' '}
											réchauffent aussi la planète : on convertit leur potentiel
											de réchauffement en équivalent CO₂ pour simplifier la
											mesure.{' '}
										</Trans>
									</details>
								</blockquote>
							</div>
						</details>
					</li>
					<li className="my-1" id={'categories'}>
						<details id={'categories'}>
							<summary className=" font-bold text-primary">
								<Trans>D’où vient mon empreinte ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<Trans i18nKey={'publicodes.Tutoriel.slide6'}>
									<p>
										Prendre la voiture, manger un steak, chauffer sa maison, se
										faire soigner, acheter une TV...
									</p>
									<div
										css={`
											margin: 0.6rem 0 1rem;
										`}
									>
										<WithEngine>
											<Chart demoMode />
										</WithEngine>
									</div>
									<p>
										L'empreinte de notre consommation individuelle, c'est la
										somme de toutes ces activités qui font notre vie moderne.{' '}
									</p>
								</Trans>
							</div>
						</details>
					</li>
				</ul>
				<ButtonLink
					href="/questions-frequentes"
					className="rounded-3xl mt-5 mb-10 border-[1px] !px-4"
					color="white"
					size="sm"
				>
					☝️ <Trans>Consultez la FAQ</Trans>
				</ButtonLink>
				<div className="bg-white w-full border-solid border-0 border-t border-gray-200 fixed h-auto sm:relative bottom-0 sm:mt-5 -m-4 right:0 left:0 py-4">
					<ButtonLink
						href="/"
						className="ml-4 border-[1px] !border-grey-200 !py-3 !px-5 !bg-grey-100 !text-gray-700"
						size="md"
					>
						←
					</ButtonLink>
					<ButtonLink
						href="/simulateur/bilan"
						onClick={() => {
							trackEvent(matomoEventParcoursTestSkipTutorial)
							skip('testIntro')
						}}
						data-cypress-id="skip-tuto-button"
						className="float-right mr-4 mb-4 right-0 !py-3"
						size="md"
					>
						{t("C'est parti !")} →
					</ButtonLink>
				</div>
			</main>
		</>
	)
}
