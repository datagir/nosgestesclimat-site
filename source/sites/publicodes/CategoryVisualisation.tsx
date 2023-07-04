import { CategoryLabel } from '@/components/conversation/UI'
import { getSubcategories } from '@/components/publicodesUtils'
import AnimatedTargetValue from '@/components/ui/AnimatedTargetValue'
import { useEngine } from '@/components/utils/EngineContext'
import { AppState } from '@/reducers/rootReducer'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import SubCategoriesChart from './chart/SubCategoriesChart'

export default ({ questionCategory: category, hideMeta = false }) => {
	const rules = useSelector((state: AppState) => state.rules)
	const engine = useEngine()

	// The aim of this component is to visualize sums. Sometimes, relevant sums are hidden behind a division
	// it should be visualized elsewhere
	const subCategories = getSubcategories(rules, category, engine)

	const categoryValue = Math.round(
		// NOTE(@EmileRolley): we assume that the category is a numeric value
		engine.evaluate(category.name).nodeValue as number
	)

	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-wrap: wrap;
			`}
		>
			{!hideMeta && (
				<div
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<CategoryLabel>
						{emoji(category.icons || '🌍')}
						{category.title}
					</CategoryLabel>
					<AnimatedTargetValue value={categoryValue} unit="kg" leftToRight />
				</div>
			)}
			<div
				css={`
					width: 100%;
				`}
			>
				<SubCategoriesChart
					{...{
						key: 'subCategoriesChart',
						color: category.color,
						rules,
						engine,
						categories: subCategories,
					}}
				/>
			</div>
		</div>
	)
}
