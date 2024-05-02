# Kenniscentrum: Where knowledge begins

This is a repository for my submission for Google AI Hackathon hosted on Devpost, which took place from March 18 until May 02, 2024.

Features:

- Implementation of Google Gemini API
- Langchain integration with gemini api
- Chat with your document
- Langchain wiki tool to search wikipedia and then generate response back using LLM
- Langchain agent integration with gemini AI to browser website and the internet.


### Prerequisites

**Node version 18.17.x** or higher. I am using v21.7.1 locally.
**API keys mentioned below and in the .env.example file**

### Cloning the repository

```shell
git clone https://github.com/trace2798/google_ai_hackathon.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
# Using Clerk for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
# For this application I am using a MySql database from aiven.
DATABASE_URL=

NEXT_PUBLIC_APP_URL="http://localhost:3000"
# Both of them will have the same API key, langchain excepts it in GOOGLE_API_KEY wording.
GEMINI_API_KEY=
GOOGLE_API_KEY=
# using upstash vector as the vector database to store the embedded content of the document
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=

BRAVE_SEARCH_API_KEY=
```


### Start the run the development server:

```shell
npm run dev
```
Open http://localhost:3000 with your browser to see the result.
