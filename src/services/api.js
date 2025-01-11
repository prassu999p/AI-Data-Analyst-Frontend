import config from '../config';

const API_URL = config.apiUrl;

export const fetchQueryResults = async (query, chartType) => {
  try {
    const fullUrl = `${API_URL}/query`;
    console.log('Calling API at:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: query, chart_type: chartType }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}; 