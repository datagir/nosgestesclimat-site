import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
	changeLangTo,
	getLangFromAbreviation,
	getLangInfos,
	Lang,
} from '../locales/translation'

export type LangSwitcherLocation = 'landing' | 'navigation'

export type LangSwitcherProps = {
	from: LangSwitcherLocation
}

export default function LangSwitcher({ from }: LangSwitcherProps) {
	const { i18n } = useTranslation()
	const currentLang = getLangFromAbreviation(i18n.language)
	const [isOpen, setIsOpen] = useState(false)
	const dispatch = useDispatch()

	const switchTo = (lang: Lang) => {
		changeLangTo(i18n, lang)
		dispatch({
			type: 'SET_LANGUAGE',
			currentLang: lang,
		})
		setIsOpen(!isOpen)
	}

	const langButtons = Object.keys(Lang)
		.filter((l) => l !== Lang.Default)
		.map((l) => [Lang[l], getLangInfos(Lang[l])])
		.map(([lang, langInfos], idx) => {
			return (
				<div
					css={`
						&:hover {
							background-color: var(--lighterColor);
						}
						border-radius: ${idx === 0
							? '0.3rem 0.3rem 0 0'
							: '0 0 0.3rem 0.3rem'};
						width: 100%;
					`}
				>
					{lang === currentLang ? (
						<SelectedButton onClick={(_) => switchTo(lang)}>
							{langInfos.abrv.toUpperCase()} - {langInfos.name}
						</SelectedButton>
					) : (
						<BaseButton onClick={(_) => switchTo(lang)}>
							{langInfos.abrv.toUpperCase()} - {langInfos.name}
						</BaseButton>
					)}
				</div>
			)
		})

	if (!isOpen) {
		return (
			<LangSwitcherContainer from={from}>
				<ClosedButton onClick={(_) => setIsOpen(!isOpen)}>
					<svg
						css={`
							padding-top: 0.3rem;
						`}
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						width="24px"
						viewBox="0 0 22 22"
						fill="#5758bb"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
					</svg>
					<span
						css={`
							color: #5758bb;
							font-weight: 500;
							font-size: 1rem;
							padding-top: 0.3rem;
							padding-left: 0.2rem;
						`}
					>
						{i18n.language.toUpperCase()}
					</span>
				</ClosedButton>
			</LangSwitcherContainer>
		)
	} else {
		return (
			<LangSwitcherContainer from={from}>
				<ColumnFlexBase>{langButtons}</ColumnFlexBase>
			</LangSwitcherContainer>
		)
	}
}

const BaseButton = styled.button`
	direction: ltr;
	font-family: inherit;
	cursor: pointer;
	color: var(--color);
	font-size: 1rem;
`

const SelectedButton = styled(BaseButton)`
	font-weight: 600;
`

const ClosedButton = styled(BaseButton)`
	border: 1px solid;
	border-radius: 0.3rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 0.3rem;
	padding-top: 0;
	margin: 0;
	background-color: var(--lightestColor);

	@media (min-width: 800px) {
		margin-top: 1rem;
	}

	&:hover {
		background-color: var(--lighterColor);
	}
`

const ColumnFlexBase = styled.div`
	border: solid 1px;
	border-radius: 0.3rem;
	border-color: var(--darkColor);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	background-color: var(--lightestColor);
	z-index: 10;

	@media (min-width: 800px) {
		position: relative;
		top: 1rem;
		right: 0px;
		display: flex;
	}
`

const LangSwitcherContainerBase = styled.div`
	position: absolute;
	top: 0.6rem;
	right: 0.6rem;
	z-index: 10;

	@media (min-width: 800px) {
		right: 2rem;
		top: 1rem;
	}
`

const LangSwitcherNav = styled(LangSwitcherContainerBase)`
	top: auto;
	@media (min-width: 800px) {
		position: relative;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`

function LangSwitcherContainer({
	from,
	children,
}: {
	from: LangSwitcherLocation
	children: JSX.Element
}) {
	switch (from) {
		case 'landing':
			return <LangSwitcherContainerBase>{children}</LangSwitcherContainerBase>
		case 'navigation':
		default:
			return <LangSwitcherNav>{children}</LangSwitcherNav>
	}
}
