import { getTitle, splitName } from 'Components/publicodesUtils'
import useFetchDocumentation from 'Components/useFetchDocumentation'
import { Markdown } from 'Components/utils/markdown'
import Meta from 'Components/utils/Meta'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default () => {
	const documentation = useFetchDocumentation()

	const { t } = useTranslation()

	if (!documentation) return null

	const { encodedName } = useParams()

	if (!encodedName) {
		return (
			<GuideWrapper>
				<Meta title={'Guide'} />
				<ScrollToTop />
				<Markdown
					children={
						documentation['guide-mode-groupe/guide'] ||
						t("Ce guide n'existe pas encore")
					}
				/>
			</GuideWrapper>
		)
	}

	const titre = utils.decodeRuleName(encodedName)
	const category = encodedName.split('-')[1]

	const actionsPlus = Object.entries(documentation)
		.filter(([key, value]) => key.startsWith('actions-plus/'))
		.map(([key, value]) => ({
			plus: value,
			dottedName: key.replace('actions-plus/', ''),
		}))

	const relatedActions = actionsPlus.filter(
		(action) => category === splitName(action.dottedName)[0]
	)

	return (
		<GuideWrapper>
			<Meta title={titre} />
			<ScrollToTop />
			<Link to={'/guide'}>
				<button className="ui__ button simple">
					<Trans>◀ Retour</Trans>
				</button>
			</Link>
			<div>
				<Markdown
					children={
						documentation['guide-mode-groupe/' + encodedName] ||
						t("Ce guide n'existe pas encore")
					}
				/>
				{encodedName !== 'guide' && relatedActions.length > 0 && (
					<>
						<h2>
							<Trans>Pour aller plus loin</Trans>:
						</h2>
						<div>
							{relatedActions.map((action) => (
								<Link
									to={
										'/actions/plus/' + utils.encodeRuleName(action.dottedName)
									}
									css="> button {margin: .3rem .6rem}"
								>
									<button className="ui__ small button">
										{getTitle(action)}
									</button>
								</Link>
							))}
						</div>
					</>
				)}
			</div>
		</GuideWrapper>
	)
}

const GuideWrapper = styled.div`
	padding: 0 0.3rem 1rem;
	margin: 1rem auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
`
