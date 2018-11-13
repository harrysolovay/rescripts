import {render} from 'react-dom'
import {HelloRescripts} from '~/components'
import {unregisterServiceWorker} from '~/utilities'

const App = () => <HelloRescripts />

render(<App />, document.getElementById('root'))
unregisterServiceWorker()
