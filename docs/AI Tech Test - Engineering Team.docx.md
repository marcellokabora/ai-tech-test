# LS\&H Engineering Team

# **AI Engineer – Interview** 

Thank you for progressing to the next stage of our interview process.

To ensure transparency and reduce unnecessary stress, this document explains the structure, expectations, and evaluation criteria in detail. The goal is to allow you to prepare and demonstrate your approach to building production-quality backend services.

## **Take-Home Exercise**

You will Build a REST API using:

* **Spring Boot (Java)** or   
* **Express / similar (Node.js)** or   
* **FastAPI / Flask (Python)**.

### **Endpoint 1 – Users**

Create an endpoint that retrieves data from:

[https://randomuser.me/api/?results=50](https://randomuser.me/api/?results=50)

Your endpoint must return exactly the same response as the external API.

The application must run locally.

### **Endpoint 2 – AI Summary**

Create an endpoint that fetches users from [https://randomuser.me/api/?results=100](https://randomuser.me/api/?results=50) and returns a natural language summary generated using an LLM.

Example response:

{  
  "summary": "The dataset contains 50 users from multiple countries. Most users are between 30 and 50 years old..."  
}

Requirements:

* The summary must be generated using an LLM.  
* You may use any external LLM provider (e.g. Gemini, OpenRouter, OpenAI,  Ollama) or another equivalent solution.  
* API keys must be configured through environment variables.  
* Handle errors gracefully.  
* You must use an external LLM provider.  
  We recommend using free-tier compatible providers such as:  
  \- Google Gemini (via Google AI Studio) [https://aistudio.google.com](https://aistudio.google.com)  
  \- OpenRouter (free models available) [https://openrouter.ai](https://openrouter.ai)  
  \- Ollama (local execution, no API key required) [https://ollama.com](https://ollama.com)

  OpenAI or Anthropic may also be used, but are not required.

### **Endpoint 3 – Natural Language Filtering**

Create an endpoint that fetches users from [https://randomuser.me/api/?results=300](https://randomuser.me/api/?results=50) and filters users based on a natural language query.

Example request:

{  
  "query": "Users older than 40"  
}

Example response:

{  
  "users": \[...\]  
}

Supported filters:

* Locatin.City  
* Age

Example queries:

People older than 40  
People younger than 30  
Users between 20 and 35  
Users over 50

Users from Charleston.  
Users living in Charleston.

Requirements:

* The natural language query should be interpreted using an LLM.  
* The LLM should produce a structured filter representation.  
* The actual filtering logic must be implemented in backend code.  
* Do not rely on the LLM to directly return the filtered users.

## **Live Coding Session**

We will:

* Review your take-home solution  
* Ask you to expand the API.

