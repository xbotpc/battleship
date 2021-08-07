import { Provider } from 'react-redux';
import Gameboard from '../../components/Gameboard/Gameboard';
import store from '../../state/store';
import './App.module.scss';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <main>
        <section>
          <Gameboard name={"Your fleet"}/>
        </section>
        <section>
          {/* <Gameboard name={"Enemy's fleet"}/> */}
        </section>
      </main>
    </Provider>
  );
}

export default App;
