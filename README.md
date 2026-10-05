# Prepwise

Prepwise is an interview-practice page with built-in technical, coding, and behavioral question sets. The practice questions run in the browser. Checking answers uses a small Python standard-library server and the OpenAI API.

## Run locally

In PowerShell, from the project folder, set your OpenAI API key and start the local server:

```powershell
$env:OPENAI_API_KEY = "your-openai-api-key"
.\.venv\Scripts\python.exe .\server.py
```

Then open <http://127.0.0.1:8000>. The API key stays on the server; do not put it in `app.js` or `index.html`. OpenAI API usage may incur charges.

Select a programming language to tailor coding prompts, choose one or more question types, and select **Show me questions**. Enter an answer and choose **Check my answer** to receive an assessment, improvement suggestions, and a sample/reference answer. Feedback is AI-generated and should be treated as coaching, not as a definitive grade; interview answers can have multiple valid approaches.

The question, follow-up, category, selected programming language, and answer you choose to check are sent to OpenAI. Resume contents and practice notes are not sent. OpenAI's data handling policies apply to submitted answers. No answers or feedback are saved by the local app. You can optionally upload a plain-text or Markdown resume (up to 1 MB), or paste resume highlights, to add a resume-based question. Use **New set** for a different selection. You can write practice notes in the answer fields and copy or download the set.
