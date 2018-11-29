import styled, {createGlobalStyle} from 'styled-components'
import '~/styles.css'
import {render} from 'react-dom'
import {registerServiceWorker} from '~/utilities'

const GlobalStyles = createGlobalStyle`
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
`

const App = () => (
  <>
    <GlobalStyles />
    <Container>
      <header children='Rescripted' />
      <a
        children={`check out the docs`}
        href='https://github.com/rescripts/rescripts'
      />
    </Container>
  </>
)

render(<App />, document.getElementById('root'))
registerServiceWorker()
