import os
import numpy as np
import faiss
import openai
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

openai.api_key = os.environ.get("OPENAI_API_KEY", "")

DATA_DIR = "docs"
INDEX_FILE = "faiss.index"
DOC_MAP_FILE = "doc_map.txt"
MODEL = "text-embedding-ada-002"

def embed(text):
    resp = openai.embeddings.create(input=[text], model=MODEL)
    return np.array(resp.data[0].embedding, dtype=np.float32)

embeddings = []
doc_files = []
for fname in os.listdir(DATA_DIR):
    if fname.endswith(".txt"):
        with open(f"{DATA_DIR}/{fname}") as f:
            text = f.read()
        emb = embed(text)
        embeddings.append(emb)
        doc_files.append(fname)

if embeddings:
    dim = embeddings[0].shape[0]
    index = faiss.IndexFlatL2(dim)
    index.add(np.vstack(embeddings))
    faiss.write_index(index, INDEX_FILE)
    with open(DOC_MAP_FILE, "w") as f:
        for fname in doc_files:
            f.write(f"{fname}\n")
    print("FAISS index created and saved as 'faiss.index'")
else:
    print("No .txt files found in docs/")
