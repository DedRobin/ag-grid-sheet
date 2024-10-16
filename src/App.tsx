import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';

// interface ISwapiRow {}

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
  return <Table results={results} />;
};

export default App;
