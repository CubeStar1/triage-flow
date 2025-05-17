import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer, CrossEncoder


# 1. Load your RAG JSON
with open('ragData.json', 'r') as f:
    corpus = json.load(f)

# 2. Prepare bi-encoder using a medical SBERT model
bi_model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')
texts = [f"{entry['id']}: {entry['data']}" for entry in corpus]
ids   = [entry['id'] for entry in corpus]
bi_embeddings = bi_model.encode(
    texts,
    convert_to_numpy=True,
    normalize_embeddings=True
)

# 3. Build FAISS index for cosine similarity (via Inner Product)
dim = bi_embeddings.shape[1]
index = faiss.IndexFlatIP(dim)
index.add(bi_embeddings)

# 4. (Optional) Cross-Encoder for re-ranking
cross_model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-12-v2')

def retrieve(query: str, k: int = 3, min_score: float = 0.4, rerank_top: int = 5):
    # Bi-encoder stage
    q_emb = bi_model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    scores, idxs = index.search(q_emb, rerank_top)
    candidates = [
        {'id': ids[i], 'data': texts[i], 'bi_score': float(scores[0][j])}
        for j, i in enumerate(idxs[0])
        if scores[0][j] >= min_score
    ]
    if not candidates:
        return []

    # Cross-encoder re-rank
    pairs = [[query, c['data']] for c in candidates]
    rerank_scores = cross_model.predict(pairs)
    for c, s in zip(candidates, rerank_scores):
        c['score'] = float(s)
    candidates.sort(key=lambda x: x['score'], reverse=True)

    # Return top-k
    return [{
        'id':      c['id'],
        'data':    c['data'],
        'similarity_score': c['score']
    } for c in candidates[:k]]

# Example usage
if __name__ == '__main__':
    results = retrieve("What triggers rosacea flare-ups?", k=3)
    for r in results:
        print(f"ID: {r['id']}\nScore: {r['similarity_score']:.4f}\n")
        print(f"{r['data'][:200]}...\n")
