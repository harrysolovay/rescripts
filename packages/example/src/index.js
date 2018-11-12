import {render} from 'react-dom'
import {HelloRescripts} from '~/components'
import {registerServiceWorker} from '~/utilities'

const App = () => <HelloRescripts />

render(<App />, document.getElementById('root'))
registerServiceWorker()
