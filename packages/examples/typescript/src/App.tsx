import React, {Component} from 'react'
import logoSvg from './logo.svg'
import './App.css'

class App extends Component {
  state = {greeting: 'dawg'}

  render() {
    console.log(require('ramda'))
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logoSvg} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Hello {this.state.greeting}
          </a>
        </header>
      </div>
    )
  }
}

export default App
