import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from '../../../locales/pages/en/méthode.md'
// import contentEs from '../../../locales/pages/es/méthode.md'
import contentFr from '../../../locales/pages/fr/méthode.md'
// import contentIt from '../../../locales/pages/it/méthode.md'

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
			title={t('meta.publicodes.Méthode.title')}
			description={t('meta.publicodes.Méthode.description')}
		/>
	)
}
