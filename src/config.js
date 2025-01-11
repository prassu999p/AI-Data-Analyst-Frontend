// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:8000'
  },
  production: {
    apiUrl: 'https://ai-data-analyst-u6m6.onrender.com'
  }
};

// Get current environment, defaults to 'development' if not set
const env = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export default config[env]; 