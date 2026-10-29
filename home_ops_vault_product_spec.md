# Home Ops Vault — Product Specification

**Document type:** Product spec for an AI coding assistant  
**Product stage:** Local V1  
**Primary user:** One household member managing information about their home  
**Product principle:** Answers should be useful, traceable to source documents, and honest about what the system does not know.

---

## Instructions for the AI coding assistant

Use this document as the product source of truth while creating **Home Ops Vault**. Build a small, coherent, working V1 rather than a broad home-management platform.

Before making substantial changes, inspect the existing repository and identify what is already implemented. Preserve useful existing work. Implement the product in small, testable increments, and keep the application runnable as you go. When a product detail is unspecified, choose the simplest behavior consistent with this spec and document the decision. Do not add features merely because a framework makes them easy.

Prioritize a complete, reliable user journey over architectural complexity. The first milestone is a user being able to add a few documents, ask a question, receive an answer supported by those documents, and inspect the evidence. Do not describe the product as complete unless its stated acceptance criteria are met.

## 1. Product overview

### 1.1 Summary

**Home Ops Vault** is a local-first, personal knowledge assistant for household documents. It helps a person find information buried in appliance manuals, warranties, purchase records, service invoices, maintenance notes, and home-project documents.

The user uploads documents they choose to include, asks a question in ordinary language, and receives a concise answer with citations to the relevant source document and page or section where available. If the documents do not support an answer, the product should say so instead of inventing a plausible response.

The initial version is a single-user application that runs on the user's computer. It is not intended to manage an entire household, perform actions on the user's behalf, or replace official manufacturer instructions or qualified professionals.

### 1.2 Product promise

> Ask a question about your home, get an answer grounded in your own documents, and see exactly where that answer came from.

### 1.3 The problem

Household information is fragmented across PDFs, emails saved as files, receipts, instruction booklets, warranty documents, service invoices, and personal notes. When a practical question comes up, the user has to remember which document might contain the answer, locate it, search it, and reconcile it with other records. Searching the open web is not always sufficient because the answer may depend on the user's own model number, purchase date, repair history, or policy document.

Home Ops Vault should reduce the time and effort required to find this information while keeping the source evidence visible.

### 1.4 Target user

The first target user is a technically capable homeowner who wants a convenient, private-feeling way to search personal household records. The user may have a small collection of appliance manuals, receipts, warranties, contractor documents, and maintenance notes, but no consistent searchable system for them.

Assume the user is comfortable uploading files and typing natural-language questions. Do not assume the user knows what RAG, embeddings, chunking, vector search, or retrieval scores mean.

## 2. Product goals and non-goals

### 2.1 Goals for V1

1. Make it easy to add a small collection of household documents.
2. Let the user ask natural-language questions about those documents.
3. Return relevant, useful answers grounded in retrieved source material.
4. Make evidence easy to inspect through citations and source excerpts.
5. Clearly communicate when available documents do not contain enough information.
6. Let the user understand which documents are indexed and remove documents they no longer want in the collection.
7. Provide a small, repeatable way to evaluate answer quality as the product evolves.
8. Run locally with a straightforward setup and without requiring a hosted product account or multi-user service.

### 2.2 Non-goals for V1

The initial release will **not**:

- Search the public internet or claim to provide current external facts.
- Automatically read the user's email, cloud drive, or other connected accounts.
- Provide a full task manager, home inventory platform, calendar, or home automation system.
- Automatically purchase parts, contact service providers, schedule appointments, or make changes to user data outside the application.
- Offer professional legal, financial, electrical, plumbing, HVAC, or other safety-critical advice.
- Replace manufacturer instructions or a qualified professional.
- Use autonomous agents or multi-agent workflows.
- Require multi-user accounts, cloud hosting, mobile apps, or production-scale deployment.
- Require OCR for scanned documents in the first release. If a file has no extractable text, the app should explain the limitation rather than silently indexing empty content.
- Promise that answers are always correct. Citations and explicit uncertainty are core design features, not a guarantee of infallibility.

## 3. Product principles

### 3.1 Evidence before confidence

An answer should be based on the documents retrieved for the question. The product must not turn a plausible guess into a statement of fact. If evidence is absent or inadequate, it should say what it could not verify.

### 3.2 Make provenance visible

Users should be able to see where an answer came from without opening files and manually searching from scratch. Citations should identify the document and, when available, the page or section. The app should display the supporting text snippet when a citation is opened.

### 3.3 Keep the first version small

The core product is **document ingestion + retrieval + grounded answers + citations**. Build that loop well before adding reminders, document classification, household inventories, integrations, or automated workflows.

### 3.4 Prefer understandable behavior

The application should make it possible to investigate why an answer was poor: which documents were ingested, what text was extracted, what passages were retrieved, and which sources were sent to answer generation. These details can live in a simple diagnostics view; they do not need to clutter the normal experience.

### 3.5 Be honest about privacy

The app runs locally and should store its document library and index locally. If a hosted embedding or language-model provider is configured, relevant document text and questions may be sent to that provider. The interface and README must clearly explain this. Do not claim that data never leaves the computer unless the configured stack truly operates entirely locally.

### 3.6 Don't make the user learn AI terminology

Use plain terms such as “documents,” “sources,” “indexed,” and “couldn't find enough evidence.” Avoid exposing technical concepts like vector distance in the main user experience.

## 4. Main user stories

1. **As a homeowner,** I want to add the manuals and records I already have so that I can ask questions about them later.
2. **As a homeowner,** I want to know whether the app has successfully processed each document so that I know what information is searchable.
3. **As a homeowner,** I want to ask a question in ordinary language rather than remember exact terminology from a manual.
4. **As a homeowner,** I want an answer with clear citations so that I can verify important details myself.
5. **As a homeowner,** I want the app to admit when my documents don't contain an answer so that I don't mistake a guess for a fact.
6. **As a homeowner,** I want to see the relevant source excerpt so that I can understand the context behind an answer.
7. **As a homeowner,** I want to remove a document from the library and have it stop appearing in future answers.
8. **As the developer of the product,** I want a fixed set of questions and expected evidence so that I can measure whether changes improve or regress quality.

## 5. V1 scope

### 5.1 Supported content

The first version should support:

- PDF documents containing extractable text.
- Plain-text files (`.txt`).
- Markdown files (`.md`).

Common initial documents include:

- Appliance and equipment manuals.
- Product specifications and filter/part documentation.
- Purchase receipts and warranty statements.
- Service invoices, repair records, and contractor quotes.
- Personal maintenance notes and home-project notes.

Support for scanned PDFs, images, spreadsheets, email integrations, and automatic web importing can be considered later. Unsupported or text-empty documents must produce a clear status and useful explanation instead of appearing to have been indexed successfully.

### 5.2 Core capabilities

V1 includes:

- Add documents through a simple upload flow.
- Extract text and source metadata.
- Index document content for retrieval.
- Ask a question about the indexed collection.
- Receive a concise answer grounded in retrieved passages.
- Inspect citations and supporting excerpts.
- Handle unsupported or unanswerable questions honestly.
- View the collection and each document's processing status.
- Remove a document and its indexed content.
- Re-index a document after it is replaced or changed, or clearly guide the user to remove and add it again if replacement is not supported.
- Run a local evaluation suite against known questions.

### 5.3 Not required for V1

- Full conversational memory across multiple questions.
- Automatic classification or extraction of household entities into a separate inventory.
- Multi-user sharing or complex permissions.
- Browser extensions, mobile support, email ingestion, or cloud-drive integrations.
- Automatic maintenance reminders and notifications.
- Internet search or live price lookups.
- Advanced agent workflows.
- OCR for scanned documents.

## 6. Core user experience

The application should have a straightforward interface with three main areas:

1. **Ask:** The primary question-and-answer workspace.
2. **Documents:** The user's document library and ingestion status.
3. **Evaluation / diagnostics:** A developer-oriented view or command that helps review retrieval and answer quality. This may be less polished than the primary UI but must be usable.

The interface should feel like a small, dependable utility, not a complex enterprise dashboard.

### 6.1 First-use experience

On first launch, the app should explain what Home Ops Vault does and guide the user to add documents. It should set expectations that answers are based only on the indexed collection and may be incomplete.

The empty state should:

- Explain that the user has no indexed documents yet.
- Offer a clear way to add files.
- Give a few example questions that will work once documents are added.
- Explain in plain language that the app needs documents before it can answer questions about the user's home.

### 6.2 Add-document flow

1. The user chooses one or more supported files.
2. The app validates file type and reasonable file-size limits.
3. The app shows processing status for each file.
4. The app extracts text and keeps the relationship between text and source document, including page number where available.
5. Successfully processed content is added to the searchable collection.
6. The user sees whether each file was indexed, skipped as a duplicate, or failed—and why.

The interface must not report success when no useful text was extracted or indexing failed. Long processing may show a progress indicator, but should always finish with a meaningful success or failure status.

### 6.3 Document library

The document list should show, at minimum:

- Document filename or display name.
- Document type or format.
- Processing/indexing status.
- Number of pages or a useful measure of content when available.
- Last indexed or added time.
- An action to inspect basic details and remove the document.

If an uploaded file has the same content as an existing document, the app should avoid silently creating duplicate indexed content. It can report that the document is already present and point to the existing entry.

Removing a document must remove its searchable chunks and associated index entries. If the original file is stored by the application, removal should delete that stored copy as well. The UI should make the consequences clear before destructive removal.

### 6.4 Asking a question

The user enters one question in plain language and submits it. The app searches the indexed document collection and produces a grounded answer.

For V1, questions should be independent. The application does not need to remember facts from a previous conversation or resolve pronouns across a long chat history. If a question is ambiguous, it may ask the user to clarify or explain what information is missing.

The application should not search the public internet. Answers must be based on the user's indexed documents, not the model's general knowledge presented as though it came from those documents.

### 6.5 Answer presentation

A normal answer should include:

- A concise direct response when enough evidence exists.
- Inline or numbered source citations associated with the claims they support.
- A source list identifying document names and page numbers or sections when available.
- An expandable view of the supporting excerpt for each citation.
- A clear uncertainty message when the sources do not sufficiently support an answer.

Don't overwhelm the user with raw retrieved chunks by default. The source excerpt should be available when the user wants to inspect it.

### 6.6 Evidence and citation behavior

Citations must be generated from actual retrieved source records, not invented by the language model. Each citation should be traceable to a known document and chunk. Page numbers should be shown when the parser can identify them; do not fabricate page numbers for text files or other sources without page structure.

A citation should support the claim it is attached to. If a response contains several factual claims, the app should make it clear which source supports which claim where feasible.

When two sources disagree, the app should identify the discrepancy and cite both sources rather than arbitrarily presenting one as unquestionably correct. If document dates or versions appear relevant, state the dates or versions found and explain the basis for comparing them.

### 6.7 Unanswerable, ambiguous, and out-of-scope questions

If the collection doesn't contain enough evidence, the app should say that it couldn't verify the answer from the uploaded documents. Where useful, it should identify what information is missing or suggest a more specific question.

Examples of good behavior:

- “I couldn't find a stated warranty end date in the indexed documents.”
- “The service invoice records the part that was replaced, but it doesn't establish the underlying cause of the failure.”
- “I found two different maintenance intervals in these documents. Here are both passages; I can't determine which one applies without confirming the model or document version.”
- “I don't have a source for the current price of that part in this document collection.”

For safety-relevant procedures, the app should remain grounded in the source, avoid filling gaps with generic instructions, and encourage consulting the manufacturer or a qualified professional when the documents do not resolve the question. It must not portray an LLM-generated answer as professional advice.

## 7. Functional requirements

The requirements below describe observable product behavior, not a mandatory code layout.

### FR-1: Add supported documents

The user can select PDF, TXT, and Markdown files. Unsupported files are rejected with a clear explanation. A failed upload or extraction must not leave a document falsely marked as searchable.

**Acceptance criteria:**

- A valid PDF with selectable text can be processed.
- A valid TXT or Markdown file can be processed.
- An unsupported type produces a clear, non-crashing error.
- A PDF with no extractable text is marked as unsupported for this V1 or failed with an explanation; it is not indexed as an empty successful document.

### FR-2: Preserve source metadata

Each indexed text segment remains associated with its parent document and, where available, its page number and section metadata.

**Acceptance criteria:**

- A retrieved segment can be traced to the source document.
- Page metadata is accurate for supported PDFs.
- A text file does not receive a fabricated page number.

### FR-3: Persistent local library

Indexed documents remain available after restarting the application.

**Acceptance criteria:**

- Index a document, restart the app, and ask a question that relies on it.
- The app can distinguish a previously indexed file from a new upload of identical content.
- The app reports ingestion failures rather than silently losing content.

### FR-4: Retrieve relevant evidence

The app retrieves a small set of relevant passages for a question from the user's indexed collection.

**Acceptance criteria:**

- Retrieval results include source IDs and text.
- Retrieval can be tested separately from answer generation.
- A developer can inspect the retrieved passages for a query.
- Retrieval is limited to the indexed collection and any explicit filters the user selected.

### FR-5: Generate grounded answers

The app uses retrieved evidence to answer questions without knowingly adding unsupported facts.

**Acceptance criteria:**

- Answer generation receives the question and retrieved source content.
- The model is instructed to distinguish evidence from missing information.
- The system can return an insufficient-evidence response.
- Answers do not pretend that public-web information was retrieved.

### FR-6: Show citations and evidence

Answers include citations that map back to retrieved sources.

**Acceptance criteria:**

- Every shown citation maps to a real source record.
- The user can view the source filename and page/section where available.
- The user can inspect a supporting excerpt.
- If a citation cannot be resolved, the app must not show it as a valid citation.

### FR-7: Remove or replace a document

The user can remove a document from the library. Its chunks must not appear in future retrieval results.

**Acceptance criteria:**

- Removal updates the visible document list.
- Subsequent searches cannot retrieve the removed document's chunks.
- If original files are stored in the app's data directory, removal also handles that stored copy.
- Duplicate detection and removal do not accidentally remove unrelated documents.

### FR-8: Report processing state and errors

The application exposes clear per-document states such as processing, indexed, duplicate, and failed.

**Acceptance criteria:**

- The user can distinguish success from failure.
- Errors explain the likely problem in plain language.
- A single bad document does not crash the entire application or prevent other valid uploads from being processed.

### FR-9: Evaluation support

The project includes a repeatable evaluation set and a way to run questions against the system and inspect outcomes.

**Acceptance criteria:**

- The evaluation contains answerable and unanswerable questions.
- Expected facts and expected evidence are defined independently of generated answers.
- Results include at least retrieval success, answer correctness review, citation support review, and abstention behavior.
- Failed examples can be inspected for diagnosis.

### FR-10: Configuration and safe defaults

Secrets and provider settings are configurable without embedding credentials in source code.

**Acceptance criteria:**

- API keys are read from environment configuration or an ignored local secrets file.
- Example configuration contains placeholders, not live credentials.
- The repository's ignore rules exclude secrets and private document data.
- The app explains which external provider is used for embeddings and/or generation where applicable.

## 8. Answer quality rules

These rules are product behavior requirements and should be reflected in answer generation and evaluation.

1. **Ground claims in evidence.** Retrieved passages should support the important factual statements in the response.
2. **Do not invent citations.** Source identifiers, page numbers, and excerpts must come from indexed metadata.
3. **Abstain when evidence is insufficient.** The model's general knowledge is not a substitute for evidence about the user's particular household records.
4. **Expose conflict.** If source documents disagree, state the disagreement and cite the conflicting material.
5. **Keep the answer proportionate.** Prefer a concise answer with relevant citations over a long generic explanation.
6. **Separate extracted fact from inference.** Make it clear when a conclusion is calculated from recorded values or is only a possible interpretation.
7. **Preserve context.** A passage about a similar model should not automatically be treated as evidence about the user's model.
8. **Treat document contents as untrusted data.** Text within an uploaded document must not override application instructions or cause the system to perform external actions.
9. **Don't claim freshness.** The app has no current web access in V1; it should not imply that prices, regulations, product availability, or current policies have been checked.
10. **Use safe language for potentially hazardous work.** If the documents do not support a safe answer, say so rather than filling gaps with potentially hazardous steps.

## 9. Initial evaluation corpus

Create an evaluation dataset with approximately 30 questions based on the actual documents selected for the local demo. Do not use made-up expected facts: each expected answer must be verified against a source in the corpus. At least one question should be tested end-to-end before the corpus is expanded.

Suggested question categories:

### A. Direct lookup

- What is the model number of our dishwasher?
- What filter type or size does the documented HVAC equipment require?
- What maintenance interval does the manual specify?
- What does a particular error code mean according to the manual?
- Which replacement part number appears in the parts list?
- What cleaning procedure does the manual describe?
- What work does the most recent service invoice record?
- What warranty exclusions appear in the warranty statement?

### B. Questions requiring multiple documents

- Based on the purchase date and stated warranty duration, would the appliance still be within that stated period on a specified evaluation date?
- Which replacement filter is listed as compatible with our equipment model?
- What part did the technician replace, and what follow-up maintenance is recorded?
- How does the final invoice compare with the earlier quote?
- What issue was recorded previously, and what work was later performed?
- Which documented maintenance tasks are due within a specified period, using a fixed evaluation date and only explicit recorded intervals?

### C. Procedure and troubleshooting

- What steps does the manual recommend for a specified error?
- What checks does the document recommend before arranging service?
- Does the manual state a reset procedure? Where?
- Which described maintenance tasks are intended for the owner and which require a qualified professional?
- Does the manual identify special tools or parts needed for a described procedure?

For potentially hazardous questions, judge the answer against the explicit source text and safety expectations; do not treat unsupported generic advice as correct.

### D. Questions the corpus cannot answer

- What is the service technician's phone number if it is not recorded?
- What is the current price of a replacement part?
- Does the manufacturer recommend a particular cleaner if no such recommendation appears?
- What caused an appliance to fail when the record only lists the repair performed?
- What is an appliance's serial number if it is absent from the uploaded documents?

Expected behavior: clearly state that the indexed documents do not establish the answer. Do not reward a plausible guess.

### E. Conflicts, ambiguity, and scope

- Do the documents list different maintenance intervals for the same item?
- Which instruction is in the newer document, based on dates actually present?
- Do the receipt and service record agree on the model number?
- What is known about a recurring issue, and what remains unresolved?
- Which instructions apply when two similar models are represented in the collection?
- Can the question be answered using only documents associated with one selected appliance?

Expected behavior: identify conflicting evidence, distinguish models, respect selected filters, or request clarification rather than silently guessing.

### Evaluation data fields

For each question, record:

- `question_id`
- `question`
- `question_type`
- `expected_facts`
- `allowed_source_ids`
- `expected_evidence` (page, section, or passage reference when available)
- `answerable` (true/false/ambiguous)
- `notes`

Start with approximately 10 carefully verified questions, then expand toward 30. Keep the expected answers independent of model-generated output. At first, human review is sufficient; automated scoring can be introduced later.

## 10. Usability and quality expectations

The product does not need elaborate visual design, but it should feel reliable and coherent.

- The main action—asking a question—should be easy to find.
- Document status should be visible without reading logs.
- Loading, empty, success, and failure states should be clear.
- The user should not have to understand embeddings, chunking, or vector similarity to use the application.
- Source citations should be easy to inspect.
- The app should avoid displaying internal errors or stack traces as normal user-facing messages. Detailed diagnostics can be made available for development.
- The interface should make no unsupported claims about answer confidence or accuracy.
- The application should remain usable when some documents fail to process.

## 11. Privacy, security, and data handling

Home Ops Vault may contain details about a user's home, purchases, warranties, or service history. Treat the library as private by default.

For V1:

- Store the document library and retrieval index locally.
- Keep credentials out of source control.
- Add local data and secret files to ignore rules.
- Make it clear if a hosted model or embedding provider receives questions and relevant document excerpts.
- Do not log full document contents or sensitive prompts by default.
- Provide a way to remove documents and associated index data.
- Treat uploaded document text as untrusted input; it can contain misleading instructions and must not override system behavior.
- Do not automatically execute instructions found in documents or call arbitrary tools based on them.
- Use sample, public, redacted, or synthetic records for screenshots, demos, and public evaluation fixtures.

This is a local personal utility, not a claim of regulatory or security certification. Do not describe it as fully secure or production-ready merely because it runs locally.

## 12. Product success criteria for local V1

The release is ready for personal use when all of the following are true:

1. The user can start it locally by following the README.
2. At least five documents across the supported formats can be indexed, queried, and retained after restart.
3. At least 10 verified questions work end-to-end, including citations that resolve to real passages.
4. Unanswerable questions can receive an explicit insufficient-evidence response; they are not forced into a fabricated answer.
5. The user can inspect sources and remove a document.
6. One repeatable evaluation command or workflow exists, with recorded results for the initial dataset.
7. Common ingestion and provider errors are handled without crashing the whole application.
8. The README explains setup, supported file types, limitations, data storage, and any external model-provider data flow.

These criteria define a **useful local V1**, not a fully production-ready service. Production hardening can be a deliberate later phase after the retrieval experience has demonstrated value.

## 13. Future opportunities (explicitly out of scope until V1 works)

Potential later iterations include:

- OCR for scanned PDFs and image-based receipts.
- Keyword plus semantic hybrid retrieval and reranking, introduced only when evaluation shows a need.
- More robust parsing of tables and complex PDFs.
- Better model-number and product-entity matching across documents.
- Document version comparison and conflict detection.
- Optional document categories and filters.
- Maintenance reminders based on explicit records and user-approved rules.
- Household inventory entries linked to source documents.
- Importing email or cloud documents through explicit integrations.
- Local embedding or language models for users who prefer not to send content to a hosted provider.
- Multi-user support and stronger access controls if there is a demonstrated need.
- A deployed version, backup strategy, and more comprehensive operational monitoring.

Do not implement these items during V1 unless a core acceptance criterion cannot otherwise be met.

## 14. Architecture and technical guardrails

The product should start as a local-first application with a clear frontend/backend boundary and a small number of replaceable infrastructure components. The intention is not to build a distributed system for V1; it is to avoid coupling product behavior to a UI framework, vector database, or model provider in ways that make future iteration expensive.

### 14.1 Chosen starting stack

Use these as the default choices unless the existing repository has a compelling, documented reason to do otherwise:

- **Frontend:** React + TypeScript + Vite. A lightweight component library and styling system may be used to move quickly, but UI components must not own RAG or document-processing logic.
- **Backend API:** Python + FastAPI, with Pydantic request/response schemas. The backend owns document processing, retrieval, answer generation, validation, and all calls to AI providers.
- **PDF text extraction:** PyMuPDF, preserving page-level provenance where possible.
- **Vector retrieval:** Chroma with persistent local storage for V1.
- **Application metadata:** SQLite, accessed through a small repository/data-access layer. SQLAlchemy is a reasonable default; use migrations if the chosen persistence layer supports them cleanly.
- **Embeddings and generation:** One chosen embedding model and one LLM provider to start, accessed through provider SDKs on the backend. Keep provider configuration out of the frontend and behind small interfaces so an alternative can be tested later.
- **Evaluation and tests:** pytest for backend and RAG tests, a repeatable command-line evaluation runner, and appropriate lightweight TypeScript tests for important frontend behavior.
- **Dependency management:** Use a reproducible Python dependency file/lock and the Node package lockfile. Document the supported local development commands.

Do not add LangChain as the core application architecture. A focused utility such as a text-splitting package may be used if it helps, but the ingest → retrieve → generate flow should remain explicit and independently testable. Do not add agents or LangGraph to V1.

### 14.2 Architectural responsibilities

Keep the responsibilities separate at a practical level. The implementation may choose its exact filenames, but it should preserve these boundaries:

1. **React frontend:** Displays documents, ingestion states, questions, answers, and citations. It talks only to the backend API. It must not call the vector store, database, embedding provider, or LLM provider directly.
2. **FastAPI routes:** Validate requests, call application services, and return defined response schemas. Routes should remain thin and should not contain prompt construction, retrieval algorithms, or persistence logic.
3. **Application services:** Coordinate document ingestion, document removal/re-indexing, retrieval, answer generation, and citation construction.
4. **Document parsing and chunking:** Convert supported files into text segments while preserving the original source relationship. Parsing and chunking must be testable without an LLM call.
5. **Retrieval service:** Retrieve candidate passages and metadata. It must be possible to inspect and evaluate retrieval results without invoking answer generation.
6. **Answer-generation service:** Receives a question and a bounded set of retrieved evidence, applies the grounding rules, and returns a response that the backend can validate. It must not fabricate source identifiers or page numbers.
7. **Storage adapters:** Keep application metadata access and vector-store operations out of the user-facing routes. This should be enough abstraction to make a later storage change feasible without introducing a large generic framework.
8. **Evaluation runner:** Exercise the same production retrieval and answer-generation services used by the API. Do not create a second, subtly different RAG implementation just for evaluation.

Avoid both extremes: do not put all behavior in one large file, and do not create an elaborate abstraction for every function. Add boundaries where they make testing or replacement easier.

### 14.3 Data ownership and provenance

Treat the application's metadata registry as the source of truth for which documents exist and their processing status. Chroma is the retrieval index, not the only record of the document library.

At minimum, maintain stable identifiers for documents and chunks. Track the original filename, content hash, supported document type, processing status, timestamps, and an error message when processing fails. Each indexed chunk must retain its document ID and page/section information when available. Store enough metadata to trace a retrieved result back to the exact source record.

Use content hashes to detect duplicate uploads and to recognize when a document's content has changed. Re-indexing should not silently leave stale chunks. Removing a document must remove its vectors/chunks and update the metadata registry; if the app stores an original file, remove that stored copy too. Handle partial failures visibly and provide a way to recover or retry rather than reporting success when the stores disagree.

Keep document files and local databases under a clearly defined local data directory, and exclude private data, indexes, database files, and local secrets from source control. Never use filenames alone as database identities.

### 14.4 Backend API contract

Use a small, explicit JSON/HTTP API under `/api/v1/`. Endpoint names can evolve with documented reasons, but the frontend must depend on the API contract rather than backend implementation details.

Minimum endpoints:

- `POST /api/v1/documents` — upload and process one or more supported documents; return per-file status and stable document IDs.
- `GET /api/v1/documents` — list documents and their status/metadata.
- `GET /api/v1/documents/{document_id}` — return details for one document.
- `DELETE /api/v1/documents/{document_id}` — remove the document and its indexed content.
- `POST /api/v1/queries` — accept a question and optional supported filters; return the answer, evidence/citations, and whether the system found sufficient evidence.
- `GET /api/v1/health` — report whether the API is available, without exposing secrets or private document data.

The query response should be structured rather than a bare answer string. It should contain the answer text, an explicit sufficient-evidence/abstention status, and a list of citations. Each citation should include a stable citation or chunk identifier, document ID, display filename, page or section where available, and a supporting excerpt. The backend must resolve citations from retrieved source records; it must never trust a model-generated filename, page number, or document ID as proof that a citation exists.

Use defined request and response schemas, predictable error shapes, and appropriate HTTP status codes. Do not leak stack traces or provider error details to the normal UI. Detailed diagnostic information can be recorded in developer logs without logging full document text or secrets by default.

The first version may process small document uploads synchronously, but the frontend should represent processing as a state rather than assuming an upload has been indexed merely because the request started. If processing later moves to a background worker, the existing document-status contract should still make sense.

### 14.5 Local operation and configuration

The app should run locally with separate frontend and backend development processes and a documented command sequence. Restrict development CORS settings to the expected local frontend origin; do not use unrestricted origins as a convenience default.

Keep provider credentials on the backend, configured through environment variables or an ignored local environment file. Never prefix secrets with frontend-public environment variable names or otherwise bundle them into the browser application. The README and UI must state which configured providers receive questions and retrieved text excerpts.

The default configuration should be easy for a single developer to use. Avoid requiring Docker, a remote database, a hosted vector database, account registration, Kubernetes, or a job queue for V1 unless the repository has a clear need for one.

### 14.6 Testing and diagnostics

At a minimum, include tests for:

- Text extraction and provenance from a representative PDF and text/Markdown files.
- Chunk metadata and stable document/chunk identity.
- Duplicate upload behavior and deletion/re-indexing behavior.
- Retrieval results against known supporting passages.
- Citation resolution, including behavior when a citation identifier is invalid.
- Unanswerable questions and source conflicts.
- API validation and visible error states for common failures.

Keep a stable evaluation dataset with expected facts and supporting source IDs. Track retrieval quality, answer correctness, citation support, and abstention behavior separately where practical. Use manual review initially; automated LLM grading may be added later, but it must not be the only source of truth.

### 14.7 Change-friendly design: preserve these seams

The following are deliberate future extension points, not reasons to over-engineer V1:

- The frontend depends on the versioned API, not on Chroma, SQLite, or provider SDKs.
- The retrieval service depends on a small vector-store interface or adapter, not Chroma-specific calls spread throughout the application.
- The generation service depends on a small model-client interface, not provider-specific response formats throughout the application.
- Prompt construction and chunking settings are centralized and testable.
- The evaluation runner uses the same application services as normal queries.
- Document IDs, chunk IDs, and citation references are stable and independent of filenames.
- Storage/schema changes are managed deliberately; do not require deleting a user's local library to update the application.

Do not add more layers than these needs justify. The goal is low-cost replacement and clear testing, not framework-building for its own sake.

### 14.8 Explicitly deferred technologies and capabilities

Do not introduce these in V1 without evidence that a core requirement cannot be met otherwise:

- LangChain as the application's central orchestration layer, LangGraph, or autonomous agents.
- PostgreSQL/pgvector or a hosted vector database.
- Cloud deployment, Kubernetes, distributed workers, or a job queue.
- Multi-user identity, tenant isolation, or cloud synchronization.
- OCR for scanned files.
- Hybrid retrieval, reranking, or more complex retrieval strategies before the evaluation set demonstrates a need.
- Multiple LLM/embedding providers or a user-facing model selection UI.

Record any deliberate deviation from this architecture in the README, including why it is needed and what it changes.

## 15. Definition of done

Home Ops Vault V1 is done when a person can launch the frontend and backend locally by following the README, upload a real but non-sensitive household document, ask a question whose answer appears in that document, receive a concise answer with an inspectable citation, ask a question that the document cannot answer and receive an honest limitation, remove the document, and rerun the evaluation workflow to see how future changes affect quality.

A clean restart must preserve the document registry and index. A frontend change must not require rewriting retrieval logic. A change to the LLM provider or vector store should be localized to its intended integration boundary rather than spread through the application. These are part of the foundation, not optional polish.

That end-to-end behavior—not the number of frameworks, features, or lines of code—is the product's first milestone.
