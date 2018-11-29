import styled, {createGlobalStyle} from 'styled-components'
import normalize from 'styled-normalize'
import '~/styles.css'
import {render} from 'react-dom'
import {registerServiceWorker} from '~/utilities'

const GlobalStyles = createGlobalStyle`
  ${normalize}
  * {
    box-sizing: border-box;
  }
  html, body {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
`

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fdee59;
  border: 10px solid #5186ec;
`

const App = () => (
  <>
    <GlobalStyles />
    <Container>
      <header children='Rescripts' />
      <a
        children={`check out the docs`}
        href='https://github.com/rescripts/rescripts'
      />
    </Container>
  </>
)

render(<App />, document.getElementById('root'))
registerServiceWorker()
