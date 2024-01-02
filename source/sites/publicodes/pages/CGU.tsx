import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from '../../../locales/pages/en/CGU.md'
// import contentEs from '../../../locales/pages/es/CGU.md'
import contentFr from '../../../locales/pages/fr/CGU.md'
// import contentIt from '../../../locales/pages/it/CGU.md'

export default () => {
	const { t } = useTranslation()
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				// [Lang.Es, contentEs],
				// [Lang.It, contentIt],
			]}
			title={t('meta.publicodes.CGU.title')}
			description={t('meta.publicodes.CGU.description')}
		/>
	)
}
