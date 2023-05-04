import { sortReleases } from 'Pages/news/NewsItem'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePersistingState } from '../hooks/usePersistState'
import { getCurrentLangInfos } from '../locales/translation'
import { capitalise0 } from '../utils'

export const localStorageKey = 'last-viewed-release'

// TODO: support translations
export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

export default function NewsBanner() {
	const { t, i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)

	const releases = sortReleases(currentLangInfos.releases),
		lastRelease = releases && releases[0]

	const [lastViewedRelease, setLastViewedRelease] = usePersistingState(
		localStorageKey,
		null
	)

	if (!lastRelease) return null // Probably a problem fetching releases in the compilation step. It shouldn't happen, the build should fail, but just in case, this potential failure should not put the whole web site down for a side feature

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	if (lastViewedRelease === undefined) {
		setLastViewedRelease(lastRelease.name)
		return null
	}

	const showBanner = lastRelease.name && lastViewedRelease !== lastRelease.name

	const date = new Date(lastRelease.published_at).toLocaleDateString(
		currentLangInfos.abrvLocale,
		{
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	)

	return showBanner ? (
		<div
			css={`
				min-width: 20rem;
				margin: 1rem !important;
				position: relative;
				text-align: left !important;
				h2 {
					display: flex;
					align-items: center;
					margin: 0rem;
				}
			`}
			className="ui__ card box"
		>
			<div>
				<h2>
					<Dot /> <Trans>Nouveautés</Trans>
				</h2>
				<div>
					<small css="line-height: 1.2rem;max-width: 12rem">
						<Trans i18nKey={'components.NewsBanner.miseAJourDate'}>
							Dernière mise à jour {{ date }}
						</Trans>
					</small>
				</div>
				<div>
					<Link to={'/nouveautés'}>{capitalise0(lastRelease.name)}</Link>
				</div>
			</div>
			<button
				onClick={() => setLastViewedRelease(lastRelease.name)}
				css="border: none; font-size: 120%; color: var(--color); position: absolute; right: .6rem; top: .6rem; padding: 0"
				title={t('Fermer la notification de nouveautés')}
			>
				&times;
			</button>
		</div>
	) : null
}

const Dot = styled.span`
	background: var(--color);
	width: 0.8rem;
	height: 0.8rem;
	display: inline-block;
	border-radius: 1rem;
	margin-right: 0.4rem;
`
