import chromadb
from chromadb.config import Settings
from app.config import CHROMA_DB_PATH
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ChromaDBService:
    def __init__(self):
        self.client = None
        self.collections = {}

    def connect(self):
        try:
            self.client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
            logger.info("Connected to ChromaDB")
            
            # Create collections if they don't exist
            self._create_collection("automotive_knowledge")
            self._create_collection("repair_procedures")
            self._create_collection("diagnostic_codes")
            
        except Exception as e:
            logger.error(f"Failed to connect to ChromaDB: {e}")
            raise

    def _create_collection(self, name: str):
        try:
            self.collections[name] = self.client.get_or_create_collection(name=name)
            logger.info(f"Collection '{name}' ready")
        except Exception as e:
            logger.error(f"Failed to create collection '{name}': {e}")
            raise

    def add_documents(self, collection_name: str, documents: List[str], 
                     metadatas: List[Dict[str, Any]], ids: List[str]):
        """Add documents to a collection with their embeddings"""
        if collection_name not in self.collections:
            self._create_collection(collection_name)
            
        collection = self.collections[collection_name]
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        logger.info(f"Added {len(documents)} documents to '{collection_name}'")

    def query_collection(self, collection_name: str, query_text: str, n_results: int = 5):
        """Query a collection for similar documents"""
        if collection_name not in self.collections:
            logger.error(f"Collection '{collection_name}' does not exist")
            return []
            
        collection = self.collections[collection_name]
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        return results

    def close(self):
        # ChromaDB doesn't require explicit closing
        logger.info("ChromaDB service shutdown")

# Create a singleton instance
vector_db_service = ChromaDBService()