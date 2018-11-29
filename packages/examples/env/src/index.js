import React from 'react'
import {render} from 'react-dom'
import {registerServiceWorker} from '~/utilities'

const App = () => <div children='rescripted' />

render(<App />, document.getElementById('root'))
registerServiceWorker()
