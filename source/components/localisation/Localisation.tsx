import supportedCountries from 'Components/localisation/supportedCountries.yaml'
import useLocalisation, {
	getFlagImgSrc,
	getCountryNameInFrench,
} from 'Components/localisation/useLocalisation'
import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'
import { getSupportedFlag } from './useLocalisation'

export default () => {
	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)
	const localisation = useLocalisation(chosenIp)
	const dispatch = useDispatch()

	const [messagesRead, setRead] = usePersistingState(
		'localisationMessagesRead',
		[]
	)

	const supported =
		localisation &&
		supportedCountries.find((c) => c.code === localisation.country.code)

	return (
		<div>
			<h2
				css={`
					border-bottom: 1px solid #eee;
					padding-bottom: 1rem;
				`}
			>
				{emoji('📍')} Région de simulation
			</h2>
			{localisation != null ? (
				supported ? (
					<p>
						Nous avons détecté que vous faites cette simulation depuis{' '}
						{getCountryNameInFrench(localisation?.country.code)}
						<img
							src={getSupportedFlag(localisation)}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						.
					</p>
				) : (
					<p>
						Nous avons détecté que vous faites cette simulation depuis{' '}
						{getCountryNameInFrench(localisation?.country.code)}
						<img
							src={getFlagImgSrc(localisation?.country.code)}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						. Pour le moment, il n'existe pas de modèle de calcul pour{' '}
						{getCountryNameInFrench(localisation?.country.code)}, vous utilisez
						le modèle Français par défault.
					</p>
				)
			) : (
				<p>
					Nous n'avons pas pu détecter votre pays de simulation. Vous utilisez
					le modèle Français par défault.{' '}
				</p>
			)}
			<details>
				<summary>Choisir un autre pays</summary>
				<ul>
					{supportedCountries.map(({ nom, code, PR }) => (
						<li
							key={code}
							onClick={() => {
								dispatch(setLocalisation({ country: { name: nom, code } }))
								const localisationPR = supportedCountries.find(
									(country) => country.code === code
								)?.PR
								dispatch({
									type: 'SET_PULL_REQUEST_NUMBER',
									number: localisationPR,
								})
								setRead([])
							}}
						>
							<button>{capitalise0(nom)}</button>
						</li>
					))}
				</ul>
				<IllustratedMessage
					emoji="🌐"
					message={
						<div>
							<p>
								Envie de contribuer à une version pour votre région ?{' '}
								<a
									target="_blank"
									href="https://github.com/datagir/nosgestesclimat/blob/master/INTERNATIONAL.md"
								>
									Suivez le guide !
									<NewTabSvg />
								</a>
							</p>
						</div>
					}
				/>
			</details>
		</div>
	)
}
