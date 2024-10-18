export async function swapiLoader() {
  const response = await fetch('https://swapi.dev/api/people');
  const { results } = await response.json();
  return results;
}
