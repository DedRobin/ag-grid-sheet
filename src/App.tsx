import Table from './components/Table';
import './App.css';
import { swapiLoader } from './api/swapi';

const App = () => {
  return <Table loader={swapiLoader} />;
};

export default App;
