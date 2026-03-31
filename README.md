# Fake News Detector (Distributed Node Consensus)

A full-stack project that detects fake news by running a distributed consensus across 4 different AI analysis nodes using OpenRouter.

## 🔎 Features

- Node backend with `Express`, `MongoDB`, `Mongoose`
- Client frontend with `React`, `Vite`, Framer Motion
- JWT auth (signup/login) and protected endpoints
- Article text analysis with 4 specialized nodes:
  - Sentiment Analyzer
  - Source Credibility
  - Fact Pattern
  - Bias Detector
- Consensus engine weights by confidence and returns final verdict (`REAL`, `FAKE`, `UNCERTAIN`)
- URL fetch and file upload text ingestion
- Article length limit up to 20,000 characters
- OpenRouter timeout/retry logic for node robustness
- History persistence and CRUD

## 🧩 Project structure

- `/client` — React SPA
- `/server` — Express API + analysis routes
- `/server/utils/openrouter.js` — distributed node orchestration
- `/server/utils/consensus.js` — consensus voting logic
- `/server/routes/analyze.js` — analyze endpoint
- `/server/routes/history.js` — history endpoints
- `/server/routes/extract.js` — URL extraction endpoint

## 🚀 Setup

### Prerequisites

- Node.js 18+
- MongoDB running (local or Atlas)
- OpenRouter API key

### Environment

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fakenews
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
OPENROUTER_NODE_TIMEOUT_MS=60000
OPENROUTER_NODE_RETRIES=1
CLIENT_URL=http://localhost:5173
```

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Run locally

Back-end:

```bash
cd server
npm run dev
```

Front-end:

```bash
cd client
npm run dev
```

Open browser: `http://localhost:5173`

## 🧪 Tests

```bash
cd server
npm test
```

## 📌 Notes

- `.gitignore` avoids checking in secrets, node_modules, log files, coverage, and OS artifacts.
- Consensus is designed to avoid false positives: low-weight real/fake signals fall back to `UNCERTAIN`.
- Retry and timeout settings are configurable via environment variables.

## 🙋‍♂️ Troubleshooting

- If article is misclassified, ensure OpenRouter node responses are returning JSON
- For timeout errors, increase `OPENROUTER_NODE_TIMEOUT_MS` and/or retries
- Check `server` logs for node status and `consensusScore` details
