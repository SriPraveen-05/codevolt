from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from typing import List
from your_streamlit_code import process_documents, chat_with_documents, hybrid_search, get_chat_history

app = FastAPI()

# Session state simulation (replace with a proper database in production)
session_state = {
    "documents": [],
    "summaries": {},
    "collection": None,
    "messages": [],
    "processed_file_hashes": {},
    "embedding_model": "",
    "chat_model": "",
}

class ChatInput(BaseModel):
    prompt: str
    temperature: float = 0.1
    memory_size: int = 3

@app.post("/upload-documents/")
async def upload_documents(files: List[UploadFile] = File(...)):
    try:
        # Process uploaded documents
        documents, summaries = process_documents(
            ollama_url="http://localhost:11434",
            model=session_state["embedding_model"],
            files=files,
            chunk_size=1000,
            chunk_overlap=200,
        )
        session_state["documents"] = documents
        session_state["summaries"] = summaries
        return JSONResponse(content={"message": "Documents processed successfully", "summaries": summaries})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/")
async def chat(chat_input: ChatInput):
    try:
        if not session_state["collection"]:
            raise HTTPException(status_code=400, detail="No documents processed yet.")
        
        # Perform hybrid search
        results = hybrid_search(
            query=chat_input.prompt,
            collection=session_state["collection"],
            documents=session_state["documents"],
            num_chunks=4,
        )
        
        # Prepare context for the chat model
        context = "\n\n".join([doc[0] for doc in results])
        summaries_text = "\n\n".join([f"{file}: {summary}" for file, summary in session_state["summaries"].items()])
        chat_history = get_chat_history(session_state["messages"], chat_input.memory_size)
        full_prompt = DEFAULT_PROMPT_TEMPLATE.format(
            context=context,
            summaries=summaries_text,
            memory=chat_history,
            question=chat_input.prompt,
        )
        
        # Generate response using the chat model
        response = chat_with_documents(
            ollama_url="http://localhost:11434",
            model=session_state["chat_model"],
            prompt=full_prompt,
            temperature=chat_input.temperature,
        )
        
        if response:
            full_response = ""
            for line in response.iter_lines():
                if line:
                    try:
                        json_response = json.loads(line)
                        if 'response' in json_response:
                            full_response += json_response['response']
                    except json.JSONDecodeError:
                        continue
            
            # Update chat history
            session_state["messages"].append({"role": "user", "content": chat_input.prompt})
            session_state["messages"].append({"role": "assistant", "content": full_response})
            
            return JSONResponse(content={"response": full_response, "relevant_chunks": results})
        else:
            raise HTTPException(status_code=500, detail="Failed to generate response from the chat model.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)