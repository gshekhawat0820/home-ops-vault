# Home Ops Vault

Home Ops Vault is a planned local-first assistant for finding answers in household documents such as appliance manuals, warranties, and service records. Answers are intended to be grounded in the user's indexed documents, with source citations and an honest response when the documents do not provide enough evidence.

The planned stack is React, TypeScript, and Vite for the frontend, with Python and FastAPI for the backend. The backend is expected to use SQLite for document records, Chroma for local vector retrieval, and a configured model provider for embeddings and answer generation. The application is not implemented yet.

The repository includes a local `data/` directory for documents and future runtime data. Personal documents and generated local data are excluded from Git. If a hosted model or embedding provider is configured later, questions and relevant document excerpts may be sent to that provider.

Setup, configuration, and run instructions will be added in Session 2, when the frontend and backend are scaffolded.