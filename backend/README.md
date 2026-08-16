# Perplexity Backend

FastAPI backend service.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for the interactive API docs.

## Test

```bash
pytest
```
