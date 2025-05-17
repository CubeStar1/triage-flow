#!/usr/bin/env python3
"""
Test script for verifying FAISS functionality in the DescriptorAgent.
"""

from agent import DescriptorAgent

def main():
    # Initialize the agent
    print("Initializing DescriptorAgent...")
    agent = DescriptorAgent()
    
    # Run the knowledge base integrity test
    print("\nRunning knowledge base integrity test...")
    integrity_results = agent.test_knowledge_base_integrity()
    
    # Run some specific test queries
    print("\nRunning specific test queries...")
    test_queries = [
        "What are the symptoms of eczema?",
        "How to treat fungal infections?",
        "What causes skin rashes?",
        "Tell me about skin cancer",
        "What are common bacterial skin infections?"
    ]
    
    for query in test_queries:
        print(f"\n{'='*80}")
        agent.test_faiss_search(query, top_k=2)
        print(f"{'='*80}")

if __name__ == "__main__":
    main() 