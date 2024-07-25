import Title from '@/components/groupe/Title'
import {
	DottedName,
	getTitle,
	NGCRule,
	NGCRules,
	splitName,
} from '@/components/publicodesUtils'
import { RuleListItem } from '@/components/SearchBar'
import Meta from '@/components/utils/Meta'
import References from '@/sites/publicodes/DocumentationReferences'
import { capitalise0, omit } from '@/utils'
import { Markdown } from 'Components/utils/markdown'
import { utils } from 'publicodes'
import { Link } from 'react-router-dom'
import DocumentationStyle from './DocumentationStyle'
import FriendlyObjectViewer from './FriendlyObjectViewer'

/*
 * This page can be seen as a rewrite of publicodes-react's DocPage.
 * The first purpose is to be able to display meaningful content to searche engines without parsing the rules.
 * The second is that I'm not sure relying on the generic publicodes-react's page suffices for our needs here on nosgestesclimat.
 * Publicodes-react could be the generic "getting started" doc package, then forked when projects go big.
 * Hence, the solution could be to provide functions that enable lib users to create their custom pages.
 * E.g. the Breadcrumb component hidden here not exposed https://github.com/betagouv/publicodes/blob/master/packages/react-ui/source/rule/Header.tsx
 *
 */

const Breadcrumb = ({ rules, dottedName }) => {
	const elements = utils
		.ruleParents(dottedName)
		.reverse()
		.map((parentDottedName) => {
			const rule = rules[parentDottedName]
			return rule === undefined ? null : (
				<span key={parentDottedName}>
					{rule.icônes !== undefined && <span>{rule.icônes}</span>}
					<Link to={utils.encodeRuleName(parentDottedName)}>
						{getTitle({ ...rule, dottedName: parentDottedName })}
					</Link>

					<span aria-hidden>{' › '}</span>
				</span>
			)
		})
	if (!elements.length) {
		return null
	}
	return <small>{elements}</small>
}

const QuestionRuleSection = ({ title, children }) => (
	<section
		css={`
			display: flex;
			justify-content: center;
			align-items: center;
			@media (max-width: 800px) {
				flex-wrap: wrap;
			}
			h3 {
				font-size: 100%;
				min-width: 14rem;
				margin: 1rem;
			}
		`}
	>
		<h3 css="margin-right:1rem">{title}</h3>
		{children}
	</section>
)

export default ({
	rule,
	dottedName,
	setLoadEngine,
	rules,
}: {
	rule: NGCRule
	dottedName: DottedName
	setLoadEngine: (value: boolean) => void
	rules: NGCRules
}) => {
	const split = splitName(dottedName)
	const title = rule.titre ?? capitalise0(split[splitName.length - 1])

	const yamlAttributesToDisplay = omit(
		[
			'couleur',
			'icônes',
			'résumé',
			'abréviation',
			'exposé',
			'question',
			'description',
			'note',
			'titre',
			'références',
			// specific to NGC actions
			'effort',
			'inactive',
			// specific to NGC form generation, could be cool to visualize, but in a <details> tag, since it's big
			'mosaique',
		],
		rule,
	)

	return (
		<div
			css={`
				max-width: calc(800px + 1.2rem);
				margin: 0 auto;
			`}
		>
			<DocumentationStyle>
				<Meta description={rule.description} title={title} />
				<header id="shareImage">
					<Breadcrumb dottedName={dottedName} rules={rules} />
					<Title title={`${rule.icônes ?? ''} ${title}`} />
				</header>
				{rule.question && (
					<>
						<QuestionRuleSection title="💬 Question pour l'utilisateur">
							<q
								css={`
									font-size: 120%;
									quotes: '«' '»' '‹' '›';
								`}
							>
								{rule.question}
							</q>
						</QuestionRuleSection>
						{rule.description && (
							<QuestionRuleSection title="ℹ️ Aide à la saisie">
								<Markdown>{rule.description}</Markdown>
							</QuestionRuleSection>
						)}
					</>
				)}
				{!rule.question && (
					<section>
						{rule.description && <Markdown>{rule.description}</Markdown>}
					</section>
				)}
				<button
					onClick={() => setLoadEngine(true)}
					className="ui__ button cta plain attention"
				>
					🧮 Lancer le calcul
				</button>
				{Object.keys(yamlAttributesToDisplay).length > 0 && (
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>

						<FriendlyObjectViewer
							data={yamlAttributesToDisplay}
							context={{ dottedName, rules }}
						/>
					</div>
				)}
				{rule.note && (
					<div>
						<h2>Notes</h2>
						<Markdown>{rule.note}</Markdown>
					</div>
				)}
				{rule.références && (
					<div>
						<h2>Références</h2>
						<References references={rule.références} />
					</div>
				)}

				<GithubContributionLink dottedName={dottedName} />
				<NamespaceRules {...{ rules, dottedName }} />
			</DocumentationStyle>
		</div>
	)
}
// Not integratable yet, see https://github.com/betagouv/publicodes/issues/336
const GithubContributionLink = ({ dottedName }) => (
	<section
		css={`
			margin: 1rem 0;
			display: block;
			text-align: right;
		`}
	>
		<a
			href={`https://github.com/search?q=${encodeURIComponent(
				`repo:datagir/nosgestesclimat "${dottedName}:"`,
			)} path:data&type=code`}
		>
			<button className="ui__ button small link-button">✏️ Contribuer</button>
		</a>
	</section>
)

const NamespaceRules = ({ rules, dottedName }) => {
	const namespaceRules = Object.keys(rules).filter(
		(key) => key.includes(dottedName) && key !== dottedName,
	)
	if (!namespaceRules.length) return null
	return (
		<section>
			<h2>Pages proches</h2>
			<ul
				css={`
					list-style: none;
				`}
			>
				{namespaceRules.map((ruleName) => {
					const item = {
						...rules[ruleName],
						dottedName: ruleName,
						espace: ruleName.split(' . ').reverse(),
					}
					const titledItem = { ...item, title: getTitle(item) }
					return (
						<RuleListItem
							key={item.dottedName}
							{...{
								rules,
								item: titledItem,
							}}
						/>
					)
				})}
			</ul>
		</section>
	)
}
