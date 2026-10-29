# Home Ops Vault — AI Coding Assistant Session Plan

**Purpose:** A milestone-by-milestone working plan for building the local V1 described in `home_ops_vault_product_spec.md`.

**Starting point:** The application codebase is empty. Do not assume that a frontend, backend, tests, dependencies, environment configuration, or working application already exist. The product spec and this session plan should be available in the repository root; if either is missing or unreadable, report that blocker rather than inventing requirements.

**Working cadence:** 18 sessions, each intended to take 60–120 minutes. At three sessions per week, this is roughly six weeks and 27–36 hours total. The target is about 4–6 hours of work per week; a session may be split if a task exceeds its timebox.

**Goal:** Bootstrap a clean repository, ship a usable local RAG application early, then improve its reliability and demonstrability. This plan is deliberately incremental: the coding assistant must stop at the end of each session, report what happened, and wait for the user to start the next session.

---

## Instructions for the AI coding assistant

Treat `home_ops_vault_product_spec.md` as the product source of truth and this file as the execution plan. If they conflict, follow the product spec and call out the conflict.

### Session execution rules

1. **Run one session at a time.** Only implement the session explicitly requested by the user (for example, “Run Session 4”). Do not continue into later sessions, even if work finishes early.
2. **Inspect before changing.** At the start of each session, inspect the repository, the product spec, the last session's notes, and relevant files. Because the starting codebase is empty, Session 1 must establish the project foundation; in later sessions, preserve working code and tests created by earlier sessions. Do not treat the absence of application code as a blocker.
3. **Start with a short plan.** State the goal, the files or areas likely to change, and the acceptance checks for this session. Keep this brief.
4. **Prefer a working vertical slice.** Make the smallest coherent change that meets the session's acceptance criteria. Avoid unrelated refactors, speculative abstractions, and unrequested features.
5. **Keep the app runnable.** Avoid leaving the repository in a broken state. If a requirement cannot be completed within the session, deliver a safe partial result, document the blocker, and do not pretend it passed.
6. **Test what changed.** Run the relevant automated tests and/or documented manual checks. Report exactly what was run and whether it passed. Never claim a test passed if it was not run.
7. **Pause at the session boundary.** When the session is complete or time is exhausted, stop coding. Do not start the next session or expand scope. Provide the session report described below and wait for the user to explicitly continue.
8. **Ask only necessary questions.** Prefer the simplest reversible choice consistent with the spec. Ask the user only when a decision materially affects product behavior, privacy, cost, or a hard-to-reverse architectural choice.
9. **Explain important deviations.** If a dependency, provider, or design choice differs from this plan, state why and update the relevant docs. Do not quietly change the stack.
10. **Never put secrets in source control.** Use environment variables and a checked-in `.env.example` with placeholders. Keep user documents and local data out of Git.

### Required end-of-session report

At the end of every session, provide:

- **Status:** Complete, Partially complete, or Blocked.
- **Delivered:** Concise list of user-visible or technical outcomes.
- **Files changed:** Important additions or modifications.
- **Verification:** Commands, tests, and manual checks actually performed, with outcomes.
- **Known issues / decisions:** Anything unfinished, assumed, or worth reviewing.
- **How to try it:** Exact local commands or steps when applicable.
- **Next session:** Its goal only—not its implementation.
- **Pause:** Explicitly state that work is stopped and wait for the user to approve or request the next session.

Do not automatically commit, push, deploy, or delete user data. Do not use real household documents for automated tests; use synthetic fixtures or redacted documents.

---

## Target architecture and guardrails

Use this as the default architecture unless the repository already contains a sound equivalent:

- **Frontend:** React + TypeScript + Vite.
- **Backend API:** Python + FastAPI with Pydantic request/response models.
- **Document parsing:** PyMuPDF for text-based PDFs; support `.txt` and `.md`.
- **Application metadata:** SQLite, using a small, explicit data-access layer (SQLAlchemy is reasonable).
- **Vector retrieval:** Chroma persistent local storage.
- **LLM and embeddings:** One provider initially, accessed through its official SDK; secrets supplied via environment variables.
- **Testing:** pytest for backend and pipeline; use the frontend test tooling already present or add a minimal suitable setup when needed.
- **Evaluation:** A stable JSON/JSONL dataset plus a repeatable command-line runner.
- **Local development:** Clear setup and run commands documented in the README.

### Suggested initial repository layout

Create a simple monorepo structure. Adjust only if the product spec or an actual environment constraint gives a clear reason:

```text
home-ops-vault/
  home_ops_vault_product_spec.md
  home_ops_vault_session_plan.md
  README.md
  .gitignore
  .env.example
  frontend/
  backend/
  docs/
    architecture.md
    progress.md
  evals/
  data/
```

The `frontend/` and `backend/` directories will gain their own package and dependency files when scaffolded in Session 2. Keep local runtime data (uploaded documents, SQLite database, Chroma files, logs, and secrets) outside version control. The exact local data directory should be documented and configurable.

### Architectural boundaries to preserve

- The React UI communicates with the backend through HTTP APIs; it does not call the LLM provider directly.
- The API layer validates requests and formats responses; it should not contain the RAG implementation itself.
- Keep document parsing, chunking, indexing, retrieval, and answer generation in separate, testable backend modules.
- Keep source metadata with every chunk: document ID, chunk ID, source filename or display name, and page number or section when available.
- Chroma stores vectors and retrieval metadata. SQLite is the source of truth for document records and processing state. Do not rely on Chroma as the only record of which documents exist.
- Define a small provider boundary for embedding and generation calls, but do not build a general-purpose plugin system.
- Prefer explicit RAG logic over a large framework abstraction. LangChain is not required; a splitter utility can be added if it genuinely helps.
- Use stable identifiers and content hashes where appropriate so duplicate uploads, indexing, and deletion can be handled predictably.
- Do not add agents, web search, OCR, multi-user auth, a job queue, cloud deployment, or elaborate frontend features in V1 unless the product spec is updated first.

### Expected end-to-end V1 flow

1. User uploads a supported file in the React UI.
2. FastAPI validates and stores the file locally and creates a document record.
3. The backend extracts text while retaining page-level provenance when possible.
4. Text is chunked; embeddings and chunks are written to persistent Chroma storage.
5. User submits a question in the UI.
6. Backend retrieves relevant chunks and passes their text and metadata to the configured LLM.
7. Backend returns a concise answer with citations tied to real source records, or a clear “not enough evidence” response.
8. The user can inspect supporting excerpts and manage indexed documents.
9. A local evaluation runner measures retrieval behavior against a fixed dataset.

---

# Week 1 — Bootstrap the empty repository

## Session 1 — Establish the project foundation

**Timebox:** 60–90 minutes

**Goal:** Turn the empty codebase into a clearly organized, version-control-safe project without prematurely implementing the application.

### Tasks
- Confirm that `home_ops_vault_product_spec.md` and `home_ops_vault_session_plan.md` are present and readable. If not, stop and report exactly which planning document is missing; do not fabricate its contents.
- Inspect the repository state and available tooling (Git, Python, Node.js, and the selected package manager). Do not assume existing application files or tests.
- Initialize Git only if the directory is not already a Git repository. Do not commit, push, or overwrite existing user files automatically.
- Create a project-level `.gitignore` that excludes at least secrets (`.env`), Python virtual environments and caches, `node_modules`, build outputs, local uploaded documents, SQLite database files, Chroma persistence data, logs, and generated evaluation results. Keep `.env.example` and synthetic sample fixtures eligible for source control.
- Create a root `README.md` describing the product in a few sentences, the intended stack, the local-first goal, and the fact that setup instructions will be completed in a later session.
- Create the initial folders for `frontend/`, `backend/`, `docs/`, `evals/`, and `data/`.
- Create `docs/architecture.md` with a simple component/data-flow diagram and the key boundaries in the product spec. It may describe planned components, but must clearly label them as not implemented yet.
- Create `docs/progress.md` and record that Session 1 established the repository baseline.
- Do not install the entire stack or start implementing app features in this session.

### Acceptance criteria
- The project has a deliberate, documented folder structure.
- `.gitignore` protects secrets, local documents, databases, vector-store data, and build artifacts.
- The README and architecture document accurately distinguish planned work from implemented functionality.
- The planning docs are available for future sessions, and no existing user file has been overwritten.
- No application feature is falsely described as working.

### Pause and evaluate
Report the detected tool versions, files created, and any missing prerequisites. If Git is available, report repository status but do not commit automatically. Wait for approval before scaffolding the frontend/backend in Session 2.

---

## Session 2 — Scaffold frontend and backend

**Timebox:** 90–120 minutes

**Goal:** Establish a clean local development environment with a React UI and FastAPI API in the empty project structure created in Session 1.

### Tasks
- Scaffold a Vite React + TypeScript frontend inside `frontend/`.
- Create a Python backend environment and FastAPI application inside `backend/`; choose and document one dependency-management approach rather than introducing several overlapping tools.
- Add environment configuration and a root or backend `.env.example` with placeholder values only. Make sure real `.env` files are ignored by Git.
- Configure local frontend-to-backend communication, including development CORS where needed.
- Add a basic home page and a `GET /api/health` endpoint.
- Add clear commands to install dependencies and run frontend and backend independently.
- Add a minimal backend test for the health endpoint.
- Verify dependency and build/test commands rather than merely writing them in documentation.

### Acceptance criteria
- Frontend starts locally and displays the app shell.
- Backend starts locally and returns a successful health response.
- A backend test passes, and the frontend production build passes.
- Frontend and backend directories each have clear dependency manifests.
- No API key, private document, SQLite database, or Chroma data is committed.

### Pause and evaluate
Report exact setup/startup commands and test/build results. If a required runtime is missing, clearly identify it and stop at a useful boundary. Do not add document ingestion or RAG yet.

---

## Session 3 — Define API contracts and document metadata storage

**Timebox:** 90 minutes

**Goal:** Create the initial document record model and stable API contracts before connecting the UI to real indexing.

### Tasks
- Define a document data model with a stable ID, display name, file type, content hash, processing status, timestamps, and a concise error message field.
- Use SQLite as the metadata source of truth. Use SQLAlchemy or an equally simple explicit data-access approach.
- Add schema creation or migrations appropriate to the project's maturity; avoid fragile ad hoc schema changes.
- Define Pydantic response models for health and document listing/status.
- Implement `GET /api/documents` returning an empty list when no documents exist.
- Document the API response shape.

### Acceptance criteria
- The database initializes from a clean local state.
- Document metadata can be read through the API.
- Model/schema behavior has a test or repeatable verification.
- The frontend and backend do not share direct database access.

### Pause and evaluate
Review the data model and API contract. Make sure document metadata is not being stored only in Chroma.

---

# Week 2 — Ingest and index documents

## Session 4 — Build the upload flow

**Timebox:** 90–120 minutes

**Goal:** Let the user upload supported documents and store them locally with a corresponding metadata record.

### Tasks
- Add a file-upload interaction in React.
- Implement `POST /api/documents` for `.pdf`, `.txt`, and `.md` files.
- Validate file extensions/content where practical and enforce a reasonable configurable size limit.
- Store files beneath a local application data directory using safe generated paths, not untrusted filenames as paths.
- Create a document record and return its ID and current status.
- Show upload success or a useful error in the UI.
- Ensure local data directories are excluded from Git.

### Acceptance criteria
- A supported file can be uploaded through the UI and stored locally.
- The API returns a stable document ID and status.
- Unsupported and oversized files fail clearly.
- Tests cover at least a successful upload and a rejected file.

### Pause and evaluate
At this point, upload does not yet need to mean “searchable.” Make the UI status honest and distinguish uploaded from indexed.

---

## Session 5 — Extract text and preserve provenance

**Timebox:** 90 minutes

**Goal:** Extract text from supported files and preserve the source location needed for citations.

### Tasks
- Implement parsers for text-based PDFs, `.txt`, and `.md`.
- For PDFs, extract text page by page and retain page numbers.
- Record parse outcomes and useful error messages.
- Detect empty or scanned PDFs where no useful text is extractable; do not mark them as successfully indexed.
- Add tests using small synthetic fixtures that contain known text on known pages.
- Ensure exceptions do not leave a false-success document status.

### Acceptance criteria
- Extracted text from fixtures matches the expected content closely enough for retrieval.
- PDF page provenance is preserved.
- An empty/textless PDF receives a clear unsupported or failed status.
- Parsing can be tested without calling an LLM.

### Pause and evaluate
Inspect the extracted text and page numbering before proceeding. Do not add OCR in V1.

---

## Session 6 — Chunk text with stable source metadata

**Timebox:** 90 minutes

**Goal:** Turn extracted text into retrievable chunks without losing the link to the source.

### Tasks
- Define a chunk data structure with a stable chunk ID, document ID, text, and source metadata.
- Choose a simple initial chunking strategy with configurable chunk size and overlap.
- Keep chunks from crossing page boundaries if doing so would make citations misleading; if a chunk combines pages, retain all applicable page references clearly.
- Preserve enough metadata to display source name and page/section later.
- Add tests for empty text, short documents, overlapping chunks, and provenance.
- Record the chunking defaults in the architecture or configuration documentation.

### Acceptance criteria
- A sample document produces sensible, non-empty chunks.
- Each chunk traces back to the correct document and source location.
- Chunking is deterministic for unchanged input and settings.
- No embeddings or LLM calls are required to run chunking tests.

### Pause and evaluate
Inspect a few resulting chunks manually. Do not optimize chunking without evaluation evidence.

---

# Week 3 — Retrieve and answer questions

## Session 7 — Add embeddings and persistent Chroma indexing

**Timebox:** 90–120 minutes

**Goal:** Index chunks in persistent local vector storage and track indexing status reliably.

### Tasks
- Choose one embedding model/provider and document its configuration.
- Add a small embedding interface so application code does not depend on provider-specific response objects.
- Create a persistent Chroma collection with suitable metadata.
- Embed and upsert the chunks for one document.
- Update the SQLite document status only when indexing has succeeded; record useful failures otherwise.
- Make repeat indexing of the same document predictable and avoid duplicate chunks.
- Add a test for the indexing logic using a fake embedding implementation where appropriate, plus a clearly documented local smoke test for the real provider.

### Acceptance criteria
- A parsed document's chunks persist in Chroma across application restarts.
- Chunk metadata includes the source identifiers required for citations.
- Failures do not leave the document falsely marked as indexed.
- No API secrets are required for unit tests.

### Pause and evaluate
Check how document status, SQLite, stored files, and Chroma remain consistent. Document any provider setup needed for the manual smoke test.

---

## Session 8 — Implement and inspect retrieval

**Timebox:** 90 minutes

**Goal:** Retrieve relevant chunks for a question without generating an answer yet.

### Tasks
- Implement a retrieval service that embeds the question and queries Chroma.
- Return structured results containing chunk text, document ID/name, page/section, chunk ID, and a diagnostic score when available.
- Add a configurable top-k value with a conservative default.
- Ensure the retrieval service can be called independently of the UI and answer-generation code.
- Add tests for result structure and document metadata propagation.
- Add a simple developer-only command or diagnostic output to inspect retrieval results for a query.

### Acceptance criteria
- A query returns relevant passages from the indexed corpus.
- Retrieved passages retain source metadata.
- Retrieval can be inspected without making an LLM generation call.
- A simple smoke test works against the local Chroma index.

### Pause and evaluate
Manually try at least five questions and inspect whether the right evidence appears in the top results. Record failures instead of immediately adding more retrieval technologies.

---

## Session 9 — Add grounded answer generation and the query API

**Timebox:** 90 minutes

**Goal:** Turn retrieved evidence into an answer through one explicit, testable generation path.

### Tasks
- Integrate one LLM provider through its official SDK and environment-based configuration.
- Define a small generation interface, separate from retrieval.
- Construct a prompt that includes the question and retrieved evidence with stable source identifiers.
- Instruct the model to answer only from the supplied evidence and say when evidence is insufficient.
- Implement `POST /api/queries` with a validated request and a structured response.
- Return the generated answer and the retrieved source objects; citations can be rendered more fully in the next session.
- Handle provider timeouts, missing configuration, and provider errors with clear API errors.

### Acceptance criteria
- A supported question produces a response based on retrieved text.
- An unanswerable question is prompted to abstain rather than use general model knowledge as evidence.
- The query route and generation logic can be tested with a fake model response.
- Provider errors are visible and do not crash the whole API.

### Pause and evaluate
Try a direct lookup and one unanswerable question. Do not add conversational memory, agents, or internet search.

---

# Week 4 — Complete the core user journey and establish a baseline

## Session 10 — Show source-backed answers in React

**Timebox:** 90–120 minutes

**Goal:** Complete the first end-to-end user journey from upload to cited question answering.

### Tasks
- Add a question input and submit behavior to the React UI.
- Connect it to the FastAPI query endpoint through a small typed API client.
- Render the answer and a citation list using source metadata returned by the API.
- Show document name and page number where available.
- Allow a citation/source excerpt to be expanded so the user can verify the evidence.
- Add loading, empty, and error states.
- Ensure the frontend treats API responses as data rather than relying on provider-specific structures.

### Acceptance criteria
- From the UI, the user can upload a supported document, wait for indexing, ask a question, and inspect a cited answer.
- Citation references resolve to real retrieved chunks; the frontend does not invent page numbers or source names.
- Loading and failure states are understandable.

### Pause and evaluate
Perform the full end-to-end flow with one known-answer question and one question with no answer in the corpus. This is the first V1 vertical-slice checkpoint.

---

## Session 11 — Complete the document library and removal behavior

**Timebox:** 90 minutes

**Goal:** Let the user understand what is in the knowledge base and remove documents consistently.

### Tasks
- Build a Documents view listing filename, type, status, and added/updated time.
- Show a useful error/status detail when processing fails.
- Implement duplicate detection using a content hash and avoid silently indexing identical content twice.
- Implement `DELETE /api/documents/{id}`.
- Ensure deletion removes the original stored file, document metadata, and all associated chunks/vectors from Chroma in a predictable order. Handle partial failures honestly and make retry/recovery possible.
- Add tests for listing, duplicate detection, and removal behavior.

### Acceptance criteria
- The user can see whether each document is uploaded, processing, indexed, or failed.
- An identical upload is handled predictably.
- After successful deletion, the document's passages no longer appear in retrieval.
- Tests cover the deletion path and relevant failure behavior.

### Pause and evaluate
Verify that a removed document cannot continue contributing answers. Do not add household asset tracking or reminders.

---

## Session 12 — Build the initial evaluation dataset

**Timebox:** 60–90 minutes

**Goal:** Create a small, stable benchmark to measure retrieval and answer behavior.

### Tasks
- Create a JSON or JSONL dataset with approximately 20–30 questions, using synthetic or redacted documents.
- Include direct lookup, multi-document, procedural, ambiguous, conflicting-source, filtered, and unanswerable questions.
- For each question, record expected facts, allowed source documents or chunk references where known, answerability, and question category.
- Ensure test fixtures contain enough information to verify expected answers independently.
- Document how to add a question without changing the benchmark's meaning.

### Acceptance criteria
- Every question has an independently verifiable expectation.
- The dataset includes both answerable and unanswerable questions.
- No test depends on a real household secret or private record.
- The dataset is committed as test data and is not generated on the fly by the LLM being evaluated.

### Pause and evaluate
Review the corpus and questions as a human before scoring the system. A flawed answer key will make later metrics misleading.

---

# Week 5 — Measure, improve, and harden

## Session 13 — Create a repeatable evaluation runner and baseline

**Timebox:** 90–120 minutes

**Goal:** Run the benchmark consistently and get an initial report of retrieval and answer quality.

### Tasks
- Add a command-line evaluation runner that reads the fixed dataset.
- Measure retrieval quality using known expected sources/chunks, including a simple Recall@k or equivalent metric where applicable.
- Record model answers and retrieved source IDs for review.
- Add a manual grading rubric for answer correctness, citation support, and abstention; avoid assuming an LLM judge is ground truth.
- Produce a machine-readable result file and a concise terminal summary.
- Record the first baseline results and key failure categories.

### Acceptance criteria
- One documented command runs the evaluation against the local app/services.
- The report includes retrieval results and enough data to inspect individual failures.
- The same benchmark can be rerun after code/configuration changes.
- Baseline limitations are documented honestly.

### Pause and evaluate
Review a sample of passing and failing cases. The report must be useful for making decisions, not just produce a single overall score.

---

## Session 14 — Improve retrieval and evidence-based abstention

**Timebox:** 90 minutes

**Goal:** Make one or two evidence-driven changes and compare them against the baseline.

### Tasks
- Choose the most common high-impact failure type from Session 13.
- Try a small, controlled adjustment such as chunk size/overlap, top-k, metadata filtering, or prompt instructions.
- Add or improve a relevance threshold/insufficient-evidence behavior only if it can be evaluated; don't treat a raw similarity score as a universal confidence score.
- Rerun the same benchmark and compare results with the baseline.
- Document the change, observed effect, and any regressions.

### Acceptance criteria
- At least one controlled experiment is recorded, even if it does not improve the score.
- Evaluation uses the same question set before and after the change.
- The chosen behavior has a clear rationale and is covered by a regression test where practical.

### Pause and evaluate
Do not add hybrid search or a reranker automatically. First decide from the observed results whether the next improvement is worth the extra complexity.

---

## Session 15 — Make ingestion and indexing resilient

**Timebox:** 90 minutes

**Goal:** Handle common document lifecycle edge cases without corrupting the searchable collection.

### Tasks
- Test malformed PDFs, empty files, textless/scanned PDFs, unsupported types, duplicate uploads, and provider failures.
- Make status transitions explicit and reliable.
- Ensure re-indexing unchanged content is idempotent; if replacement/re-indexing is supported, ensure old chunks are removed after successful replacement.
- Ensure deletion or indexing failures leave enough state to diagnose and retry safely.
- Add useful tests for the most important lifecycle cases.

### Acceptance criteria
- Unsupported or unreadable documents never appear as successfully indexed.
- Duplicate indexing does not multiply the same content indefinitely.
- Re-indexing and deletion do not leave stale chunks that can be retrieved as current content.
- Errors are visible and actionable.

### Pause and evaluate
Review consistency between SQLite, stored files, and Chroma. Prioritize correctness over adding new features.

---

# Week 6 — Prepare a credible local V1

## Session 16 — Add diagnostics, privacy messaging, and basic security checks

**Timebox:** 90 minutes

**Goal:** Make behavior diagnosable and make data flow explicit to the user.

### Tasks
- Add structured logs for ingestion, retrieval, and generation errors without logging secrets or full private document contents by default.
- Capture basic timing for parsing, embedding/indexing, retrieval, and answer generation; record usage/cost when the provider exposes it.
- Add request IDs or correlation IDs if straightforward.
- Ensure API keys stay on the backend and remain out of version control.
- Add a UI/README notice explaining that a hosted provider may receive questions and retrieved document excerpts.
- Test a document containing prompt-injection-style instructions; treat retrieved text as untrusted evidence, not system instructions.
- Verify file-size and input validation limits.

### Acceptance criteria
- Errors can be diagnosed using logs and returned messages without exposing secrets.
- The privacy notice accurately reflects actual provider/data behavior.
- Prompt-injection text in a document does not override system behavior or cause tools/actions to run.
- Basic upload limits and configuration validation are tested.

### Pause and evaluate
This is a local single-user V1, not a security certification. Document known limitations and avoid claiming the application is fully secure or production-ready.

---

## Session 17 — Make setup reproducible and document the system

**Timebox:** 90 minutes

**Goal:** Ensure another developer can understand, run, and test the project.

### Tasks
- Write or update a README with prerequisites, environment setup, configuration, start commands, tests, evaluation, and troubleshooting.
- Ensure `.env.example` contains placeholders and real `.env` files are ignored by Git.
- Document where files, SQLite, and Chroma data are stored and how to reset local development data safely.
- Add a simple architecture diagram and describe the ingestion/query flow.
- Add a concise decision record for the main architecture choices and known tradeoffs.
- Run backend tests, frontend checks/build, and the evaluation command using the documented steps.
- If time permits, add a lightweight CI workflow for repeatable checks; do not let CI work displace required product behavior.

### Acceptance criteria
- Setup works from a clean checkout using the documented steps, apart from explicitly stated provider credentials.
- Tests/build checks are documented and runnable.
- Local data and secrets are not accidentally included in source control.
- Architecture and known limitations are clear.

### Pause and evaluate
Ask whether a developer unfamiliar with the project could get it running. Fix missing instructions before adding polish.

---

## Session 18 — Release-candidate review and demo

**Timebox:** 90–120 minutes

**Goal:** Verify the V1 promise end to end, fix only high-impact defects, and produce an honest release summary.

### Tasks
- Start the application from a clean/reproducible state using the README instructions.
- Upload several synthetic sample documents spanning at least two household items.
- Run representative direct, multi-document, conflicting-source, and unanswerable questions.
- Verify citations and source excerpts against the actual source documents.
- Run the full automated test suite and evaluation benchmark.
- Fix the highest-impact defects that fit in the session; otherwise record them clearly.
- Prepare a short demo script and note the current evaluation results, limitations, and next three improvements.

### Acceptance criteria
- The main V1 user journey works locally from upload through cited answer.
- A document can be removed and its content no longer appears in future retrieval.
- The benchmark runs and its result is recorded.
- The app has documented setup instructions and known limitations.
- The coding assistant does not claim “production-ready” merely because the local demo works.

### Pause and evaluate
End with a release-candidate report and a prioritized next-iteration backlog. Do not start V2 features in this session.

---

# Progress tracker

Use the checkboxes below as a lightweight manual tracker. Only mark a session complete when its acceptance criteria have been checked, not merely when the code was written.

## Week 1 — Foundation
- [ ] Session 1 — Establish the project foundation
- [ ] Session 2 — Scaffold frontend and backend
- [ ] Session 3 — API contracts and document metadata storage

## Week 2 — Ingestion and indexing
- [ ] Session 4 — Upload flow
- [ ] Session 5 — Text extraction and provenance
- [ ] Session 6 — Chunking and source metadata

## Week 3 — Retrieval and answer generation
- [ ] Session 7 — Embeddings and Chroma indexing
- [ ] Session 8 — Retrieval service
- [ ] Session 9 — Grounded answer generation and query API

## Week 4 — End-to-end experience and test data
- [ ] Session 10 — Cited answers in React
- [ ] Session 11 — Document library and deletion
- [ ] Session 12 — Evaluation dataset

## Week 5 — Evaluation and hardening
- [ ] Session 13 — Evaluation runner and baseline
- [ ] Session 14 — Evidence-driven retrieval improvements
- [ ] Session 15 — Ingestion/indexing resilience

## Week 6 — V1 finish
- [ ] Session 16 — Diagnostics, privacy, and basic security checks
- [ ] Session 17 — Reproducible setup and documentation
- [ ] Session 18 — Release-candidate review and demo

---

# Prompt to start a session

Copy this prompt into the AI coding assistant whenever you begin a session. Replace `{N}` with the session number.

> Read `home_ops_vault_product_spec.md` and `home_ops_vault_session_plan.md`. The starting application codebase is empty, so do not expect an existing app. Execute **Session {N} only**. First inspect the repository and summarize the current state, then state a short plan for this session. Implement only the tasks needed to meet that session's acceptance criteria, preserving any user files and any working behavior from prior sessions. Run the relevant tests and checks and report the exact results. If any criterion cannot be met in the available session, state what remains and why; do not silently expand scope or continue to the next session. Finish with the required end-of-session report, stop coding, and wait for my explicit instruction before proceeding.

## End-of-session notes template

Copy this under the relevant session in a separate `docs/progress.md` file or project notes:

```markdown
### Session N — [title]
- Date:
- Status: Complete / Partially complete / Blocked
- Delivered:
- Files changed:
- Tests/checks run:
- Manual verification:
- Evaluation result (if applicable):
- Decisions / assumptions:
- Known issues:
- Next session:
```

## Definition of V1 complete

V1 is complete when the user can run the app locally, upload and manage supported documents, ask questions against indexed content, inspect real source citations and excerpts, receive an honest insufficient-evidence response when necessary, and run a repeatable evaluation suite. Anything beyond that belongs in a separately prioritized iteration plan.
