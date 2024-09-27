import {
	deleteSimulationById,
	setActionsChoices,
	setAllStoredTrajets,
	setCurrentSimulation,
} from '@/actions/actions'
import { Simulation, Situation } from '@/types/simulation'
import { Trans } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export default ({ dispatch, list, currentSimulationId }) => {
	const [searchParams] = useSearchParams()
	const idAgir = searchParams.get('id-agir')

	return (
		<ul>
			{list.map((simulation: Simulation) => {
				const dateSimu =
					simulation.date !== undefined ? new Date(simulation.date) : new Date()
				return (
					<li key={simulation.id} css="list-style-type: none">
						<details>
							<summary>
								<div
									css={`
										display: inline-flex;
									`}
								>
									<span>{dateSimu.toLocaleDateString()}</span>
									<span
										css={`
											margin-left: 0.25rem;
											width: 8rem;
											overflow: hidden;
											white-space: nowrap;
											text-overflow: ellipsis;
											@media (max-width: 800px) {
												display: none;
											}
										`}
									>
										- {simulation.id}
									</span>
									{currentSimulationId === simulation.id ? (
										<span>
											<span css="margin: 0 1rem">
												✅ <Trans>Chargée</Trans>
											</span>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													exportSimulationToAgir(simulation.situation, idAgir)
												}}
											>
												<Trans>Exporter vers Agir</Trans>
											</button>
										</span>
									) : (
										<span>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													dispatch(setCurrentSimulation(simulation))
													dispatch(setActionsChoices(simulation.actionChoices))
													dispatch(
														setAllStoredTrajets(simulation.storedTrajets)
													)
												}}
											>
												<Trans>Charger</Trans>
											</button>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													dispatch(deleteSimulationById(simulation.id))
												}}
											>
												<Trans>supprimer</Trans>
											</button>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													exportSimulationToAgir(simulation.situation, idAgir)
												}}
											>
												<Trans>Exporter vers Agir</Trans>
											</button>
										</span>
									)}
								</div>
							</summary>
							<ul>
								<li>
									Date complète : {dateSimu.toLocaleDateString()}{' '}
									{dateSimu.toLocaleTimeString()}.
								</li>
								<li>Identifiant : {simulation.id}.</li>
							</ul>
						</details>
					</li>
				)
			})}
		</ul>
	)
}

async function exportSimulationToAgir(
	situation: Situation,
	idAgir: string | null
) {
	const apiUrl = 'https://agir-back-dev.osc-fr1.scalingo.io/bilan/importFromNGC' // Remplacez par l'URL réelle du point de terminaison de l'API sur l'autre site

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ situation, utilisateurId: idAgir }),
		})

		if (!response.ok) {
			throw new Error('Export a échoué')
		}

		const responseData = await response.json()
		if (responseData.id)
			window.location.href =
				'https://agir-front-dev.osc-fr1.scalingo.io/?importNGC=' +
				responseData.id
		else console.error("Erreur lors de l'export de la simulation")

		console.log('Simulation exportée avec succès :', responseData)
	} catch (error) {
		console.error("Erreur lors de l'export de la simulation :", error)
	}
}
