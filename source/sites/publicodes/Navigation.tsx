import SessionBar from 'Components/SessionBar'
import { useContext } from 'react'
import LangSwitcher from '../../components/LangSwitcher'
import Logo from '../../components/Logo'
import { IframeOptionsContext } from '../../components/utils/IframeOptionsProvider'
import useMediaQuery from '../../hooks/useMediaQuery'
import SkipLinks from './SkipLinks'

export default ({ fluidLayout }) => {
	const { isIframe } = useContext(IframeOptionsContext)

	const largeScreen = useMediaQuery('(min-width: 800px)')

	return (
		<>
			<SkipLinks />
			{!fluidLayout && (
				<nav
					id="mainNavigation"
					tabIndex={0}
					css={`
						display: flex;
						justify-content: center;
						margin: 0.6rem auto;

						outline: none !important;

						@media (min-width: 800px) {
							flex-shrink: 0;
							width: 12rem;
							height: 100vh;
							${isIframe && `height: 100% !important;`}
							overflow: none;
							margin: 0 auto;
							position: sticky;
							top: 0;
							flex-direction: column;
							justify-content: start;
							border-right: 1px solid #eee;
						}
					`}
				>
					<Logo
						showText={largeScreen}
						size={largeScreen ? 'medium' : 'small'}
					/>
					<SessionBar />
					<LangSwitcher from="navigation" />
				</nav>
			)}
		</>
	)
}
