from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from agent import app as agent
from dotenv import load_dotenv
from phoenix.otel import register
from langsmith import Client

load_dotenv()

app = FastAPI()

# creating the client for langsmith
client = Client()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

# creating a websocket endpoint to stream the output to react frontend
@app.websocket("/ws/research")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            topic = await websocket.receive_text()
            print(f"📩 Topic received: {topic}")

            output = {}
            async for step in agent.astream({"topic": topic}):
                # Live stream processing chunks
                await websocket.send_text(json.dumps({
                    "type": "stream",
                    "content": step
                }))

                # You can keep collecting relevant stuff in `output` if needed
                output.update(step)

            # Once done, send metadata as a final message
            metadata = {
                "search_queries": output.get("search_queries", []),
                "wiki_queries": output.get("wiki_queries", []),
                "search_results_length": len(output.get("search_results", "")),
                "wiki_results_length": len(output.get("wiki_results", "")),
                "compilation_length": len(output.get("compilation", "")),
            }

            await websocket.send_text(json.dumps({
                "type": "metadata",
                "content": metadata
            }))

    except Exception as e:
        print(f"Error: {e}")
