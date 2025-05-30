import os
import openai
import faiss
import numpy as np
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

openai.api_key = os.environ.get("OPENAI_API_KEY", "")

DATA_DIR = "docs"
INDEX_FILE = "faiss.index"

def embed(texts, model="text-embedding-ada-002"):
    BATCH = 10
    embs = []
    for i in range(0, len(texts), BATCH):
        chunk = texts[i:i+BATCH]
        resp = openai.embeddings.create(input=chunk, model=model)
        embs.extend([d.embedding for d in resp.data])
    return np.array(embs).astype("float32")

def get_documents():
    docs = []
    doc_names = []
    for fname in os.listdir(DATA_DIR):
        with open(os.path.join(DATA_DIR, fname), "r") as f:
            txt = f.read()
            docs.append(txt)
            doc_names.append(fname)
    return docs, doc_names

if __name__ == "__main__":
    docs, doc_names = get_documents()
    print(f"Embedding {len(docs)} documents...")
    X = embed(docs)
    print("Building FAISS index...")
    index = faiss.IndexFlatL2(X.shape[1])
    index.add(X)
    faiss.write_index(index, INDEX_FILE)
    with open("doc_map.txt", "w") as f:
        for fname in doc_names:
            f.write(fname + "\n")
    print("Done.")
