import styled from 'styled-components'

const Section = styled.section`
	margin: 0 auto 1rem;
	font-family: 'Marianne', sans-serif;
	padding: 0;
`
Section.TopTitle = styled.h1`
	font-size: 2rem;
	margin-bottom: 1.5rem !important;
	font-family: 'Marianne', sans-serif;

	@media screen and (max-width: ${800}px) {
		font-size: 2rem;
	}
`
Section.Title = styled.h2`
	font-size: 1.5em;
	font-family: 'Marianne', sans-serif;
	margin-bottom: 1rem;
`

Section.Intro = styled.details`
	margin: 1rem 0 1rem 0;
	p {
		font-size: 1rem;
		line-height: 1.3rem;
	}
	> summary {
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
	}
`

Section.Sector = styled.span`
	color: red;
`

export default Section
