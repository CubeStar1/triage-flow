**Project: Simple Local RAG with FAISS and SBERT**

This project demonstrates a minimal Retrieval-Augmented Generation (RAG) setup running entirely locally using FAISS and a Sentence-Transformer model. The core script is contained in `FAISS.py`, which:

1.  Loads a JSON knowledge base (`ragData.json`) of medical image class descriptions.

2.  Embeds each entry's text with a lightweight SBERT model (`all-MiniLM-L6-v2`).

3.  Builds a FAISS index over normalized embeddings for cosine-similarity retrieval.

4.  Defines a simple `retrieve(query, topk)` function that returns the most relevant passages.

* * * * *

Prerequisites
-------------

-   Python 3.10+

-   pip

Installation
------------

1.  Clone or download this repository.

2.  Install required packages:

    ```
    pip install faiss-cpu sentence-transformers numpy

    ```

    or 

    ```
    pip install -r requirements.txt

    ```

File Structure
--------------

```
project-root/
├── FAISS.py          # Main script with retrieval logic
├── ragData.json      # JSON file containing your RAG 
├── README.md         # This instruction file
└── utils/            # Contains utility files

```

Usage
-----

1.  Ensure your `ragData.json` sits in the same directory.

2.  Open `FAISS.py` to verify the paths and model name (default: `all-MiniLM-L6-v2`).

3.  Run the script:

    ```
    python FAISS.py

    ```

4.  The script will print the top-k results for the example query inside the `__main__` block.

5.  To integrate into your own code, import the `retrieve` function:

    ```
    from FAISS import retrieve

    results = retrieve("What triggers rosacea flare-ups?", topk=3)
    for r in results:
        print(r['id'], r['score'])

    ```

Code Overview
-------------

-   **Model Initialization**: Loads `all-MiniLM-L6-v2` SBERT for fast sentence embeddings.

-   **Embedding**: Converts each concatenated `id: data` passage into a normalized vector.

-   **FAISS Index**: Builds an `IndexFlatIP` index to perform inner-product (cosine) similarity.

-   **Retrieval**: Embeds the query, searches the FAISS index for the top-k nearest neighbors, and returns their IDs, full text, and similarity scores.

Customization
-------------

-   **Model**: Swap `all-MiniLM-L6-v2` for any other Sentence-Transformer model by updating the `SentenceTransformer(...)` call.

-   **Top-k**: Change `topk` in `retrieve(query, topk)` for more or fewer results.

-   **Data**: Update `ragData.json` with your own dataset entries following the same structure:

    ```
    [
      {
        "id": "Class Name",
        "data": "Detailed description text..."
      },
      ...
    ]

    ```

* * * * *

This setup provides instant, high-quality retrieval without complex re-ranking or external APIs---perfect for rapid prototyping or embedded RAG workflows.