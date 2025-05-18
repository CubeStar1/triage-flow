import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# 1) Load RAG data
with open('ragData.json', 'r') as f:
    corpus = json.load(f)
passages = [ f"{e['id']}: {e['data']}" for e in corpus ]
ids      = [ e['id']               for e in corpus ]

# 2) Embed all passages (once)
model = SentenceTransformer('all-MiniLM-L6-v2')
embs  = model.encode(passages, convert_to_numpy=True, normalize_embeddings=True)

# 3) Build FAISS index (cosine via inner product on normalized vectors)
dim   = embs.shape[1]
index = faiss.IndexFlatIP(dim)
index.add(embs)

# 4) Retrieval function
def retrieve(query, topk=3):
    # embed query
    q_emb = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
    # search
    scores, idxs = index.search(q_emb, topk)
    # collect results
    return [
        {
            'id':     ids[idx],
            'data':   passages[idx],
            'score':  float(scores[0][i])   # cosine similarity in [0,1]
        }
        for i, idx in enumerate(idxs[0])
    ]

# Example usage
if __name__ == '__main__':
    for r in retrieve("What triggers rosacea flare-ups?", topk=5):
        print(f"{r['id']} (score={r['score']:.3f})")
        print(f"→ {r['data'][:200]}...\n")
