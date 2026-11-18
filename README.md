# Home Ops Vault

Home Ops Vault is a local-first assistant for finding answers in household documents such as appliance manuals, warranties, and service records. The project is being built in small milestones, with the goal of grounding future answers in source documents and making uncertainty clear.

The current scaffold includes a React + TypeScript + Vite frontend, a FastAPI backend with a health endpoint, and an automated backend test. Document upload, search, SQLite metadata, Chroma, and model-provider integration are not implemented yet.

The project is designed to keep household files and future runtime data local. The `data/` directory is user data: do not add its contents to Git. If an external model provider is configured in a later milestone, relevant questions and document excerpts may leave the computer; no provider is configured by this scaffold.

## Prerequisites

- Node.js 20 or newer and npm.
- Python 3.11.

## Install dependencies

Install the frontend dependencies:

```bash
cd frontend
npm ci
```

Create and install the backend virtual environment:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

`backend/requirements.txt` pins the runtime, test, and transitive dependencies. Python 3.11 and pip are already available in the development environment, so this scaffold uses the standard-library `venv` and pip rather than adding another dependency manager. The virtual environment keeps packages separate from system Python.

## Run the applications

Start the backend in one terminal:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API health endpoint is available at <http://127.0.0.1:8000/api/health>.

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite. The page checks the backend through the Vite `/api` development proxy; the backend must be running for the connection status to show as connected. Frontend and backend can also be started independently.

## Verify the scaffold

Run the backend test:

```bash
cd backend
source .venv/bin/activate
python -m pytest
```

Type-check and build the frontend for production:

```bash
cd frontend
npm run build
```

## Environment and privacy

`backend/.env.example` is a placeholder for possible future backend-only provider configuration. Session 2 does not load it or require credentials. Never put secrets or provider API keys in `frontend/` or in `VITE_*` variables, because Vite exposes those variables to browser code. Do not copy real values into the checked-in example file.

The existing `.gitignore` excludes local `.env` files, dependencies, build output, databases, and local application data.