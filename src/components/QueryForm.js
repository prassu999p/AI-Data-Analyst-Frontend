import { fetchQueryResults } from '../services/api';

// ... in your component
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const data = await fetchQueryResults(query, selectedChartType);
    setResults(data);
  } catch (error) {
    setError('Failed to fetch data from API');
  } finally {
    setIsLoading(false);
  }
}; 