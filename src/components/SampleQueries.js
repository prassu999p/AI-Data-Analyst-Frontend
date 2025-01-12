import React from 'react';

const SAMPLE_QUERIES = [
  "What is the total sales amount for each month in 2024?",
  "What is the total quantity sold for each product name?",
  "Identify the top 5 customers by total sales amount.",
  "What percentage of total sales comes from each category?"
];

const SampleQueries = ({ onQuerySelect }) => {
  return (
    <div className="sample-queries">
      <h4>Try these sample queries:</h4>
      <div className="query-chips">
        {SAMPLE_QUERIES.map((query, index) => (
          <button 
            key={index}
            className="query-chip"
            onClick={() => onQuerySelect(query)}
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleQueries; 