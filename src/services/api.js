const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchQueryResults = async (query, chartType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: query,
        chart_type: chartType === 'auto' ? null : chartType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Add other API calls here... 