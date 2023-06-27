import SafeCategoryImage from '@/components/SafeCategoryImage'
import { findContrastedTextColor } from '@/components/utils/colors'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { getFocusedCategoryURLSearchParams } from '../utils'
import TriangleShape from './TriangleShape'

export default ({
	nodeValue,
	total,
	icons,
	color,
	title,
	delay = 0,
	indicator,
	filterSimulationOnClick,
	dottedName,
	click,
	clicked,
}) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const percent = (nodeValue / total) * 100

	return (
		<motion.li
			initial={{ opacity: 0, width: 0 }}
			animate={{ opacity: 1, width: `calc(${percent}% - 0px)` }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ duration: 0.5, delay }}
			css={`
				border-right: 2px solid var(--lighterColor);
				background: ${color};
				cursor: pointer;
				position: relative;
			`}
			title={title}
			data-cypress-id={`sub-category-bar-${dottedName}`}
			onClick={() =>
				filterSimulationOnClick
					? navigate(
							`${pathname}?${getFocusedCategoryURLSearchParams(dottedName)}`
					  )
					: click(dottedName)
			}
		>
			{indicator && (
				<div
					css={`
						svg {
							width: 1rem;
							height: 1rem;
						}
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: -1.2rem;
					`}
				>
					<TriangleShape color={color} />
				</div>
			)}
			<span
				css={`
					img {
						height: 1.7rem;
						margin-top: -0.1rem;
						width: auto;
					}
				`}
			>
				{clicked ? (
					<span
						key={title}
						css={`
							color: ${findContrastedTextColor(color, true)};
							display: flex;
							flex-direction: column;
							align-items: center;
						`}
					>
						<SafeCategoryImage element={{ dottedName, icons }} />
						<div>{title}</div>
						<div>{Math.round((nodeValue / total) * 100)}&nbsp;%</div>
					</span>
				) : (
					<SafeCategoryImage element={{ dottedName, icons }} />
				)}
			</span>
		</motion.li>
	)
}
