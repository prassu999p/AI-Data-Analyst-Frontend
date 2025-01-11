const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://ai-data-analyst-u6m6.onrender.com',
  environment: process.env.NODE_ENV || 'development',
};

console.log('Current environment:', config.environment);
console.log('API URL from config:', config.apiUrl);

export default config; 