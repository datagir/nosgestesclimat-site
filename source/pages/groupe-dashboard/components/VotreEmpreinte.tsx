import Title from '@/components/groupe/Title'
import ChevronRight from '@/components/icons/ChevronRight'
import { ResultsObject } from '@/types/groups'
import { useTranslation } from 'react-i18next'

const EMOJI_TEXT_MAP: {
	[key in keyof Partial<ResultsObject>]: {
		emoji: string
		text: string
	}
} = {
	transports: {
		emoji: '🚗',
		text: 'Transports',
	},
	alimentation: {
		emoji: '🍽',
		text: 'Alimentation',
	},
	logement: {
		emoji: '🏠',
		text: 'Logement',
	},
	divers: {
		emoji: '📦',
		text: 'Divers',
	},
	'services sociétaux': {
		emoji: '🏥',
		text: 'Services publics',
	},
}

export default function VotreEmpreinte({
	results,
}: {
	results?: ResultsObject
}) {
	const { t } = useTranslation()
	return (
		<>
			<Title
				title={t('Votre empreinte')}
				subtitle={t('Par rapport à la moyenne du groupe')}
			/>
			<ul className="mt-4">
				{Object.entries(results || {}).reduce((acc, [key, value]) => {
					if (!EMOJI_TEXT_MAP?.[key]) return acc
					return [
						...acc,
						<li
							key={`cat-${key}`}
							className="flex items-center justify-between py-4 border-solid border-0 border-b-[1px] border-gray-200"
						>
							<div className="flex items-center">
								<div className="flex-shrink-0 text-2xl">
									<span>{EMOJI_TEXT_MAP[key].emoji}</span>
								</div>
								<div className="ml-4">
									<div className="text-md font-bold text-gray-900">
										{EMOJI_TEXT_MAP[key].text}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-sm text-primary bg-primaryLight border-solid border-[1px] border-primaryBorder rounded-[5px] p-1">
									{value} {t('t')}
								</div>
								<div className="flex-shrink-0">
									<span className="text-sm text-gray-500">
										<ChevronRight />
									</span>
								</div>
							</div>
						</li>,
					]
				}, [] as JSX.Element[])}
			</ul>
		</>
	)
}
