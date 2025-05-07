# Project README

## Overview

This project consists of a model and a React-based frontend web application. The model is responsible for detecting the sentiment of text (positive or negative) using the `transformers` library in Python. The React frontend provides a user interface for submitting comma-separated text inputs to the model and displaying the sentiment analysis results, including accuracy scores.

## Model

### Description

* **Type:** Sentiment analysis model
* **Problem:** Detects the sentiment (positive or negative) of a given text.
* **Key Algorithms/Techniques:** Uses the `transformers` library in Python, specifically the `pipeline` module for sentiment analysis.
* **Inputs:** Text string.
* **Outputs:** Sentiment label (positive or negative) and an accuracy score.
* **Origin:** The model utilizes pre-trained models from the Hugging Face `transformers` library.
* **Libraries/Frameworks:** Python, `transformers`, and Flask.
* **Hardware Requirements:** No specific hardware requirements.

### How to Use the Model

1.  **Installation:**

    * Ensure you have Python installed.
    * Install the required Python packages:

        ```bash
        pip install transformers flask
        ```

2.  **Usage:**
    * The Model and the Webapplication can be run by main.py
    * The model is deployed using Flask. To run the model only:

        1.  Navigate to the `model` directory: `cd model`
        2.  Run the python script: `python model.py` (or `flask run`)

    * The Flask application will expose an API endpoint (e.g., `/sentiment`) that the frontend will use.
    * The model expects a POST request with the text data.
    * The model returns a JSON response containing the sentiment label and accuracy score.

3.  **Configuration:**

    * The model can be configured by modifying the Flask application (`model.py`)
    * The `pipeline` uses a default model for sentiment analysis, but you can specify a different pre-trained model from Hugging Face if needed.

4.  **Example:**

    * (Example is for how the backend is used, not standalone)
    * Send a POST request to the flask api `/sentiment`
    * with a body like:

        ```json
        {
          "text": "This is a great product!"
        }
        ```

    * The response will be a JSON object:

        ```json
        {
          "sentiment": "POSITIVE",
          "score": 0.98
        }
        ```

## React Frontend

### Description

* **Purpose:** Provides a user interface for interacting with the sentiment analysis model.
* **Main Features:**

    * Takes comma-separated text inputs from the user.
    * Sends the input text to the model's API.
    * Displays the sentiment analysis results (sentiment label and accuracy score) for each input text.
* **Interaction with the Model:** The frontend sends text data to the model's Flask API endpoint and receives sentiment analysis results.
* **State Management:** React's `useState` is used for managing the input text and the results.
* **Key Components:**

    * Input component for entering comma-separated texts.
    * Component for displaying the sentiment analysis results.
* **UI Libraries/Frameworks:** React.
* **Type:** Single Page Application (SPA)

### How to Set Up the Frontend

1.  **Prerequisites:**

    * Node.js and npm (or yarn)

2.  **Installation:**

    * Clone the repository.
    * Navigate to the `webapp` directory: `cd webapp`
    * Install dependencies: `npm install` (or `yarn install`)

3.  **Configuration:**

    * Ensure the frontend is configured to communicate with the correct backend API endpoint. This is usually done in a configuration file or environment variable.

4.  **Running the Application:**

    * Start the development server: `npm run dev` (or `yarn dev`)

5.  **Deployment:** (Optional) If you have deployment instructions, include them here.

### Frontend Structure
```
└── 📁model
    └── model.py
    └── sentiment-analysis.joblib
└── 📁webapp
    └── 📁src
        └── App.jsx
        └── main.jsx
    └── eslint.config.js
    └── index.html
    └── package-lock.json
    └── package.json
    └── vite.config.js
```

## Interaction Between Frontend and Model

* **API Endpoints:**

    * The frontend sends a POST request to the `/sentiment` endpoint (or similar) on the Flask server.
    * Request:

        ```json
        {
          "text": "text1, text2, text3"
        }
        ```

    * Response:

        ```json
        [
          {"text": "text1", "sentiment": "POSITIVE", "score": 0.95},
          {"text": "text2", "sentiment": "NEGATIVE", "score": 0.88},
          {"text": "text3", "sentiment": "POSITIVE", "score": 0.92}
        ]
        ```

* **Data Flow:**

    1.  User enters comma-separated text in the frontend.
    2.  The frontend sends the text to the Flask backend's `/sentiment` endpoint.
    3.  The Flask backend uses the `transformers` model to analyze the sentiment of each text.
    4.  The Flask backend sends the results (sentiment and score) back to the frontend.
    5.  The frontend displays the results to the user.

* **Communication Protocol:** HTTP, REST.
