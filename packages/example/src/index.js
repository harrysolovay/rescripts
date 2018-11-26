import {render} from 'react-dom'
import {registerServiceWorker} from '~/utilities'

const App = () => <div children='Rescripted' />

render(<App />, document.getElementById('root'))
registerServiceWorker()
