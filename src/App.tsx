import { useEffect, useState } from 'react';
import Table from './components/Table';
import './App.css';

const App = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function sendRequest() {
      const response = await fetch('https://swapi.dev/api/people');
      const data = await response.json();
      setResults(data.results);
    }

    sendRequest();
  }, []);

  return <>{results.length ? <Table results={results} /> : 'Loading'}</>;
};

export default App;
