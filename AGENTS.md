# Home Ops Vault — Agent Instructions

## Project Context

Home Ops Vault is a local-first RAG application for organizing and querying household documents.

Before making architectural or product decisions, consult:

- `home_ops_vault_product_spec.md` — product requirements and architecture.
- `home_ops_vault_session_plan.md` — implementation sequence and session acceptance criteria.
- `docs/architecture.md` — current architecture and technical decisions.
- `docs/progress.md` — completed work and current project status.

Treat these documents as the sources of truth. Do not contradict established decisions without explaining the reason and proposing an update.

## Architecture

The intended technology stack is:

- Frontend: React, TypeScript, and Vite.
- Backend: Python and FastAPI.
- Document extraction: PyMuPDF.
- Vector storage: Chroma with local persistence.
- Application metadata: SQLite.
- Testing: pytest, frontend build checks, and a project-specific RAG evaluation suite.

Prefer straightforward implementations and explicit data flows over unnecessary abstractions.

Use direct provider SDKs and a transparent RAG pipeline. Avoid introducing agents, LangGraph, or heavyweight orchestration frameworks without a demonstrated need.

Keep components modular at well-defined boundaries so providers and infrastructure can be changed later without redesigning the application.

## Development Principles

- Preserve existing work. Inspect files before modifying or replacing them.
- Follow the current session's acceptance criteria and avoid unrelated scope expansion.
- Prefer small, understandable changes over large rewrites.
- Avoid adding dependencies unless they provide clear value.
- Use Python type hints and TypeScript types appropriately.
- Handle errors explicitly and provide useful error messages.
- Keep configuration separate from application code.
- Never hardcode credentials, API keys, or other secrets.

## Data and Privacy

The `data/` directory contains local household documents and must be treated as user data.

- Never delete, move, rename, or modify original source documents unless explicitly instructed.
- Do not add household PDFs or other private source documents to Git.
- Do not upload, transmit, or include document contents in agent prompts or external services during development unless explicitly requested and authorized.
- Keep secrets and local environment files out of version control.
- Keep original source PDFs unchanged; perform extraction and processing on application-managed data.

The eventual application may use configured external embedding and LLM providers. Make these data flows explicit and document their privacy implications.

## Testing and Verification

- Add or update tests when changing application behavior.
- Run relevant tests after implementation.
- Run the frontend production build when frontend code changes.
- Verify API behavior rather than assuming successful implementation.
- Never claim a test passed unless it was actually executed and passed.
- Report failures and known limitations honestly.

## Documentation

Keep documentation consistent with the implementation.

Update relevant documentation when changing architecture, dependencies, environment configuration, API contracts, or developer workflows.

Do not document planned functionality as implemented functionality.

## Completion Reports

At the end of each implementation session, summarize:

1. Work completed.
2. Files created or modified.
3. Tests and verification commands executed, including actual results.
4. Known issues or incomplete work.
5. Any architectural decisions or deviations.
6. The next planned session.

Do not commit or push changes unless explicitly instructed.
