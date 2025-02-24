from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
import json

# Set proxy environment variables
os.environ["http_proxy"] = "http://proxy-dmz.intel.com:911/"
os.environ["https_proxy"] = "http://proxy-dmz.intel.com:911/"
os.environ["no_proxy"] = "localhost,.intel.com,.internal,.local,intel.com,.intel.com,127.0.0.1,172.18.217.229,172.18.217.189"

# Proxy settings (Modify these according to your network)
PROXY = "http://proxy-dmz.intel.com:912"
PROXIES = {
    "http": PROXY,
    "https": PROXY
}

headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Origin": "http://10.241.104.119",  # Or the appropriate origin URL
}

API_URL = "http://172.18.217.189:9000/v1/chat/completions"

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a request model for input
class MessageRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

def processMathSteps(input_str):
    # Parse the JSON string into a Python dictionary
    print(input_str)
    response_dict = json.loads(input_str)

    # Extract the answer
    answer = response_dict.get("answer", "No answer found")

    # Extract and format all steps
    steps = response_dict.get("steps", [])
    steps_text = "\n".join([f"Step {step['step']}: {step['detail']}" for step in steps])

    # Print the result
    print(f"Answer: {answer}\n{steps_text}")
    return {"answer": answer, "steps": steps_text}

@app.post("/api/submit")
async def receive_message(request: MessageRequest):
    print("request received")
    payload = {
        "model": "meta-llama/Llama-3.1-8B-Instruct",
        "messages": [
            {
                "role": "student",
                "content": request.message
            }
        ]
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=2000)
        response.raise_for_status()  # Raise error if request fails
        data = response.json()
        data = data['choices'][0]['message']['content']
        data = processMathSteps(data)
        return {"response": data['answer'], "details": data['steps']}
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request timed out.")
    except requests.exceptions.RequestException as e:
        # Log the error details for debugging
        print(f"Error with external API: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
