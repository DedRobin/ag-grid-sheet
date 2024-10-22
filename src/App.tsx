import Table from './components/Table';
import './App.css';
import { swapiLoader } from './api/swapi';

const App = () => {
  return (
    <>
      <button
        onClick={() => localStorage.clear()}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        CLear LS
      </button>
      <Table loader={swapiLoader} />;
    </>
  );
};

export default App;
