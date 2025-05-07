// Main App component
// This component allows users to input comma-separated text,
// send it to a sentiment analysis API,
// and displays the results in a table.
import React, { useState, useCallback } from 'react';

// Placeholder for API endpoint
const SENTIMENT_API_URL = 'http://localhost:5000/api/analyze_sentiment'; // Replace with your Flask API endpoint

/**
 * Expected JSON structure from the API:
 * [
 * {
 * "text": "The original text snippet",
 * "sentimentScore": 0.85, // A numerical score (e.g., -1 to 1, or 0 to 1)
 * "sentimentLabel": "Positive" // Optional: A human-readable label (e.g., "Positive", "Negative", "Neutral")
 * },
 * {
 * "text": "Another piece of text",
 * "sentimentScore": -0.5,
 * "sentimentLabel": "Negative"
 * }
 * // ... more items
 * ]
 */

const App = () => {
  // State for the input text
  const [inputText, setInputText] = useState('');
  // State for the sentiment analysis results
  const [results, setResults] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);

  // Handle input text change
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Handle form submission
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter some text.');
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    // Split the comma-separated text into an array of individual texts
    const texts = inputText.split(',').map(text => text.trim()).filter(text => text.length > 0);

    if (texts.length === 0) {
        setError('No valid text snippets found. Please ensure texts are separated by commas.');
        setIsLoading(false);
        return;
    }

    try {
      // --- API Call  ---

      const response = await fetch(SENTIMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texts: texts }), // Send texts as { "texts": ["text1", "text2"] }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
      // --- End of API Call  ---



    } catch (err) {
      console.error("API Call Failed:", err);
      setError(err.message || 'Failed to analyze sentiment. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sky-400">Sentiment Analyzer</h1>
          <p className="text-slate-400 mt-2">
            Enter comma-separated phrases to analyze their sentiment.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-6">
            <label htmlFor="textInput" className="block mb-2 text-sm font-medium text-sky-300">
              Enter Text (comma-separated):
            </label>
            <textarea
              id="textInput"
              value={inputText}
              onChange={handleInputChange}
              placeholder="e.g., I love this product!, This is not good, The weather is okay"
              rows="4"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
        </form>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-700/50 border border-red-500 text-red-200 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Results Table Section */}
        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-sky-400 text-center">Analysis Results</h2>
            <div className="overflow-x-auto max-h-96 bg-slate-700 rounded-lg shadow-inner"> {/* Scrollable container */}
              <table className="min-w-full divide-y divide-slate-600">
                <thead className="bg-slate-700 sticky top-0"> {/* Sticky header */}
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">
                      Text Snippet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">
                      Sentiment Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">
                      Sentiment Label
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-700 divide-y divide-slate-600">
                  {results.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-600/50 transition-colors">
                      <td className="px-6 py-4 whitespace-pre-wrap break-words text-sm text-slate-200">{item.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                        {item.sentimentScore !== undefined ? item.sentimentScore.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.sentimentLabel === 'POSITIVE' ? 'bg-green-600/70 text-green-100' :
                          item.sentimentLabel === 'NEGATIVE' ? 'bg-red-600/70 text-red-100' :
                          item.sentimentLabel === 'NEUTRAL' ? 'bg-yellow-600/70 text-yellow-100' :
                          'bg-yellow-600/70 text-yellow-100'
                        }`}>
                          {item.sentimentLabel || 'Neutral'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
         {/* No Results Yet Message */}
        {!isLoading && !error && results.length === 0 && inputText && (
             <div className="mt-8 text-center text-slate-400">
                <p>Submit text above to see sentiment analysis results.</p>
            </div>
        )}
      </div>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Sentiment Analyzer App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;

