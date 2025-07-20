# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Import LangChain components for Google Gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate

# Load environment variables from .env file
load_dotenv()

# Ensure the Google API key is set
if os.getenv("GOOGLE_API_KEY") is None:
    print("Error: GOOGLE_API_KEY is not set in the .env file.")
    exit()

# --- Pydantic Model for Request Body ---
class PromptRequest(BaseModel):
    prompt: str

# --- FastAPI App Initialization ---
app = FastAPI()

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LangChain Setup with Google Gemini ---
# 1. Initialize the Language Model (LLM)
# We now use ChatGoogleGenerativeAI with the "gemini-1.5-flash" model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

# 2. Define the Prompt Template (this remains the same)
prompt_template = ChatPromptTemplate.from_template(
    "You are a helpful DevOps assistant. Based on the user's request, provide a clear and concise answer. \n\nUser Request: {user_prompt}"
)

# 3. Create the chain using the modern pipe syntax
chain = prompt_template | llm


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "AI DevOps Agent Backend is running with Google Gemini."}

@app.post("/api/generate")
def generate_response(request: PromptRequest):
    try:
        # Run the chain with the user's prompt
        response = chain.invoke({"user_prompt": request.prompt})
        
        # The response object has a 'content' attribute
        return {"response": response.content}
    except Exception as e:
        # Provide a more detailed error response to the frontend
        print(f"An error occurred: {e}")
        return {"error": f"An error occurred on the server: {e}"}

