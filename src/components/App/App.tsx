import { Provider } from 'react-redux';
import store from '../../state/store';
import './App.module.scss';

function App(): JSX.Element {
  return (
    <Provider store={store}>
    </Provider>
  );
}

export default App;
