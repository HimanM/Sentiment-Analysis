
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS

# Initialize the Flask application
app = Flask(__name__)
CORS(app) # Enable CORS for all routes, allowing requests from your React app
MODEL = joblib.load('model\sentiment-analysis.joblib')




# --- API Endpoint to Analyze Sentiment ---
@app.route('/api/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    """
    API endpoint to receive texts and return dummy sentiment analysis.
    Expects a JSON payload with a "texts" key, which is a list of strings.
    e.g., {"texts": ["I love this!", "This is not good."]}
    """
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Validate if 'texts' key exists and is a list
        if not data or 'texts' not in data or not isinstance(data['texts'], list):
            return jsonify({"error": "Invalid input. 'texts' key with a list of strings is required."}), 400

        input_texts = data['texts']
        results = []

        # Process each text snippet
        for text in input_texts:
            if not isinstance(text, str):
                # Skip non-string items, or handle as an error
                # For this dummy API, we'll just assign a neutral sentiment
                results.append({
                    "text": str(text), # Ensure it's a string for the response
                    "sentimentScore": 0.0,
                    "sentimentLabel": "Neutral"
                })
                continue

            #Use the model to determine sentiment
            resp_array = MODEL([text])
            score = resp_array[0].get("score")
            label = resp_array[0].get("label")


            results.append({
                "text": text,
                "sentimentScore": score,
                "sentimentLabel": label
            })

        # Return the results as JSON
        return jsonify(results), 200

    except Exception as e:
        # Log the exception for debugging (optional)
        print(f"Error processing request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- Root Endpoint (Optional) ---
@app.route('/')
def home():
    """
    A simple root endpoint to check if the API is running.
    """
    return "Flask Sentiment Analysis Dummy API is running!"

# --- Main execution block ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    
