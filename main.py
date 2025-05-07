import subprocess
import os
import time

def start_model_and_webapp():
    """
    Starts the Flask server for the model and then runs the React development server.
    """
    try:
        # Start the model (model.py) in a separate process
        print("Starting the model (model.py)...")
        model_process = subprocess.Popen(["python", "model/model.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        # Give the model some time to start. Adjust this as needed.
        time.sleep(5)  # 5 seconds

        # Check if the model process is running
        if model_process.poll() is not None:
            print(f"Model process exited with error code {model_process.returncode}.  Check model/model.py for errors.")
            return

        # Navigate to the webapp directory
        print("Navigating to the webapp directory...")
        os.chdir("webapp")

        # Start the React development server (npm run dev)
        print("Starting the React development server (npm run dev)...")
        webapp_process = subprocess.Popen(["npm", "run", "dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

        # Print the output from the React development server
        for line in webapp_process.stdout:
            print(line.decode().strip())

        # Optionally, you could also print the stderr to capture errors
        for line in webapp_process.stderr:
            print(line.decode().strip())

        # Wait for both processes to complete (optional)
        model_process.wait()
        webapp_process.wait()

        print("Both processes finished.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Ensure that processes are terminated
        if model_process:
            model_process.terminate()
        if webapp_process:
            webapp_process.terminate()

if __name__ == "__main__":
    start_model_and_webapp()
