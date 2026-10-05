const form = document.querySelector("#generator-form");
const questionList = document.querySelector("#question-list");
const resultsTitle = document.querySelector("#results-title");
const resultsMeta = document.querySelector("#results-meta");
const resultsActions = document.querySelector("#results-actions");
const resultsFooter = document.querySelector("#results-footer");
const formError = document.querySelector("#form-error");
let currentQuestions = [];
let currentEvaluations = new Map();

const questionSets = {
  Technical: [
    {
      prompt: "How would you explain the most important parts of {{role}} to a non-technical teammate?",
      followUp: "Which detail would you leave out, and why?"
    },
    {
      prompt: "Tell me about a technical decision you made on a project related to {{role}}.",
      followUp: "What alternatives did you consider?"
    },
    {
      prompt: "How do you approach debugging a problem you have never seen before?",
      followUp: "How do you decide when to ask someone for help?"
    },
    {
      prompt: "What trade-offs do you consider when choosing a tool or technology for a project?",
      followUp: "Can you give an example of a time the trade-off mattered?"
    },
    {
      prompt: "How do you make sure your work is reliable and maintainable?",
      followUp: "What checks do you use before calling a task complete?"
    },
    {
      prompt: "Describe a technical concept you learned recently that changed how you work.",
      followUp: "How have you applied it?"
    },
    {
      prompt: "How would you investigate a feature that has become noticeably slower?",
      followUp: "What would you measure before making changes?"
    },
    {
      prompt: "What does good collaboration between technical and non-technical teammates look like?",
      followUp: "How do you handle a disagreement about scope?"
    },
    {
      prompt: "How do you balance delivering a feature quickly with keeping the implementation healthy?",
      followUp: "What signals would tell you that a shortcut needs to be revisited?"
    },
    {
      prompt: "How do you approach learning an unfamiliar codebase?",
      followUp: "What would you try to understand during your first few days?"
    },
    {
      prompt: "What makes a technical explanation clear and useful?",
      followUp: "How would you adapt your explanation for a different audience?"
    },
    {
      prompt: "Tell me about a technical challenge you would be excited to take on in a {{role}} position.",
      followUp: "What would your first steps be?"
    }
  ],
  Coding: [
    {
      prompt: "Given a list of numbers, return the two indices whose values add up to a target. Explain your approach.",
      followUp: "What are the time and space complexities?"
    },
    {
      prompt: "Write a function that checks whether a string is a palindrome, ignoring spaces and letter case.",
      followUp: "How would you handle punctuation and Unicode characters?"
    },
    {
      prompt: "Given a list of words, group together the words that are anagrams.",
      followUp: "What key would you use to group each word?"
    },
    {
      prompt: "Write a function that removes duplicate values from a list while preserving their original order.",
      followUp: "How would your solution change if the input were too large to fit in memory?"
    },
    {
      prompt: "Given a string containing brackets, determine whether every opening bracket is correctly matched.",
      followUp: "What data structure makes this problem easier?"
    },
    {
      prompt: "Write a function that finds the first non-repeating character in a string.",
      followUp: "How would you return a useful result if every character repeats?"
    },
    {
      prompt: "Merge two sorted lists into one sorted list without sorting the result again.",
      followUp: "What is the runtime of your approach?"
    },
    {
      prompt: "Given a list of integers, find the length of the longest consecutive sequence.",
      followUp: "Can you solve it without sorting the input?"
    },
    {
      prompt: "Write a function that returns the most frequent item in a list.",
      followUp: "How would you handle ties?"
    },
    {
      prompt: "Given a sorted list and a target, return the index of the target or indicate that it is missing.",
      followUp: "How can you reduce the number of comparisons?"
    },
    {
      prompt: "Write a function that flattens a nested list of values.",
      followUp: "Would you use recursion or iteration, and why?"
    },
    {
      prompt: "Design a function that validates whether a string is a well-formed email address.",
      followUp: "What edge cases would you test, and what should validation not attempt to guarantee?"
    }
  ],
  Behavioral: [
    {
      prompt: "Tell me about a time you had to learn something quickly to complete a task.",
      followUp: "How did you decide what to learn first?"
    },
    {
      prompt: "Describe a time you disagreed with a teammate about how to approach a problem.",
      followUp: "How did you reach a decision together?"
    },
    {
      prompt: "Tell me about a project or task that did not go as planned.",
      followUp: "What would you do differently next time?"
    },
    {
      prompt: "Give an example of a time you received feedback that changed how you work.",
      followUp: "What specific change did you make?"
    },
    {
      prompt: "Describe a time you had to manage competing priorities.",
      followUp: "How did you communicate what could and could not be done?"
    },
    {
      prompt: "Tell me about a time you took ownership of a problem that was not clearly assigned to you.",
      followUp: "What was the outcome?"
    },
    {
      prompt: "Describe a time you made a mistake at work or during a project.",
      followUp: "How did you address it and prevent a repeat?"
    },
    {
      prompt: "Tell me about a time you helped a teammate succeed.",
      followUp: "How did you know what kind of support they needed?"
    },
    {
      prompt: "Describe a time you had to explain a difficult idea to someone unfamiliar with it.",
      followUp: "How did you check that your explanation was understood?"
    },
    {
      prompt: "Tell me about an accomplishment you are proud of.",
      followUp: "What was your individual contribution?"
    },
    {
      prompt: "Describe a time you worked with incomplete or changing requirements.",
      followUp: "How did you reduce uncertainty and keep others informed?"
    },
    {
      prompt: "Tell me about a time you improved a process or made everyday work easier.",
      followUp: "How did you measure whether the change helped?"
    }
  ]
};

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

function chooseQuestions(categories, count, role, programmingLanguage, resumeProvided) {
  const practiceCount = resumeProvided ? count - 1 : count;
  const perCategory = new Map(categories.map((category) => [category, shuffle(questionSets[category])]));
  const questions = [];

  while (questions.length < practiceCount) {
    let addedQuestion = false;
    for (const category of shuffle(categories)) {
      const next = perCategory.get(category).pop();
      if (!next) continue;
      let prompt = next.prompt.replaceAll("{{role}}", role);
      if (category === "Coding" && programmingLanguage) {
        prompt = `${prompt} Solve it in ${programmingLanguage}.`;
      }
      questions.push({
        category,
        prompt,
        followUp: next.followUp
      });
      addedQuestion = true;
      if (questions.length === practiceCount) break;
    }
    if (!addedQuestion) break;
  }

  if (resumeProvided) {
    questions.unshift({
      category: "Resume",
      prompt: `Looking at your resume, walk me through a project or achievement that best demonstrates your fit for a ${role} role.`,
      followUp: "What was your specific contribution, and what would you improve if you did it again?"
    });
  }
  return questions;
}

function renderQuestions(questions) {
  questionList.replaceChildren();
  questionList.classList.add("has-questions");

  questions.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    card.style.animationDelay = `${Math.min(index * 45, 250)}ms`;

    const top = document.createElement("div");
    top.className = "question-card-top";
    const category = document.createElement("span");
    category.className = "question-category";
    category.textContent = question.category;
    const number = document.createElement("span");
    number.className = "question-number";
    number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
    top.append(category, number);

    const prompt = document.createElement("p");
    prompt.className = "question-prompt";
    prompt.textContent = question.prompt;
    const followup = document.createElement("p");
    followup.className = "question-followup";
    const label = document.createElement("strong");
    label.textContent = "Go deeper: ";
    followup.append(label, document.createTextNode(question.followUp));

    const answerLabel = document.createElement("label");
    answerLabel.className = "answer-label";
    answerLabel.htmlFor = `answer-${index}`;
    answerLabel.textContent = "Your answer";
    const answer = document.createElement("textarea");
    answer.className = "answer-input";
    answer.id = `answer-${index}`;
    answer.maxLength = 5000;
    answer.rows = 4;
    answer.placeholder = "Jot down your answer here…";
    answer.setAttribute("aria-label", `Your answer to question ${index + 1}`);

    const evaluateButton = document.createElement("button");
    evaluateButton.className = "evaluate-button";
    evaluateButton.type = "button";
    evaluateButton.textContent = "Check my answer";
    evaluateButton.dataset.questionIndex = String(index);

    const evaluation = document.createElement("section");
    evaluation.className = "answer-evaluation";
    evaluation.hidden = true;
    evaluation.setAttribute("aria-live", "polite");

    answer.addEventListener("input", () => {
      currentEvaluations.delete(index);
      evaluation.hidden = true;
      evaluation.replaceChildren();
      evaluateButton.textContent = "Check my answer";
    });

    card.append(top, prompt, followup, answerLabel, answer, evaluateButton, evaluation);
    questionList.append(card);
  });

  resultsTitle.textContent = "Your questions, your moment.";
  const includesResumeQuestion = questions.some((question) => question.category === "Resume");
  resultsMeta.textContent = `${questions.length} questions from your selected practice sets${includesResumeQuestion ? ", including a resume-based question" : ""}. Pick one and start practicing.`;
  resultsMeta.hidden = false;
  resultsActions.hidden = false;
  resultsFooter.hidden = false;
}

function appendEvaluationSection(container, title, content) {
  if (!content || (Array.isArray(content) && content.length === 0)) return;

  const section = document.createElement("p");
  const heading = document.createElement("strong");
  heading.textContent = `${title}: `;
  section.append(heading, document.createTextNode(Array.isArray(content) ? content.join(" ") : content));
  container.append(section);
}

function showEvaluation(container, evaluation) {
  container.replaceChildren();
  container.classList.toggle("is-unrelated", evaluation.assessment === "needs_work");

  const heading = document.createElement("h4");
  const assessments = {
    correct: "Correct",
    partly_correct: "Partly correct",
    needs_work: "Needs work",
    strong: "Strong answer"
  };
  heading.textContent = `${assessments[evaluation.assessment]} · ${evaluation.score}/5`;
  container.append(heading);

  appendEvaluationSection(container, "Feedback", evaluation.feedback);
  appendEvaluationSection(container, "What you did well", evaluation.strengths);
  appendEvaluationSection(container, "To improve", evaluation.improvements);
  appendEvaluationSection(container, "Sample answer", evaluation.reference_answer);
  appendEvaluationSection(container, "Note", evaluation.note);
  container.hidden = false;
}

async function evaluateAnswer(button) {
  const index = Number(button.dataset.questionIndex);
  const question = currentQuestions[index];
  const answer = document.querySelector(`#answer-${index}`).value.trim();
  const evaluation = button.nextElementSibling;

  if (!answer) {
    evaluation.classList.remove("is-unrelated");
    evaluation.replaceChildren();
    const message = document.createElement("p");
    message.className = "evaluation-error";
    message.textContent = "Write your answer before asking for feedback.";
    evaluation.append(message);
    evaluation.hidden = false;
    return;
  }

  button.disabled = true;
  button.textContent = "Checking…";
  evaluation.classList.remove("is-unrelated");
  evaluation.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "evaluation-loading";
  loading.textContent = "Reviewing your answer…";
  evaluation.append(loading);
  evaluation.hidden = false;

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: question.category,
        question: question.prompt,
        followUp: question.followUp,
        answer,
        programmingLanguage: document.querySelector("#programming-language").value
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Couldn’t check this answer. Please try again.");
    }

    currentEvaluations.set(index, result);
    showEvaluation(evaluation, result);
    button.textContent = "Check again";
  } catch (error) {
    evaluation.replaceChildren();
    const message = document.createElement("p");
    message.className = "evaluation-error";
    message.textContent = error instanceof TypeError
      ? "Couldn’t reach the feedback service. Start Prepwise using the server instructions in README.md."
      : error.message;
    evaluation.append(message);
    evaluation.hidden = false;
    button.textContent = "Try again";
  } finally {
    button.disabled = false;
  }
}

function generateQuestions() {
  const role = document.querySelector("#role").value.trim();
  const programmingLanguage = document.querySelector("#programming-language").value;
  const resumeProvided = Boolean(document.querySelector("#resume-highlights").value.trim());
  const categories = [...form.querySelectorAll('input[name="category"]:checked')].map((input) => input.value);
  const count = Number(document.querySelector("#question-count").value);

  if (!role) {
    formError.textContent = "Add the role you’re preparing for to build your practice set.";
    formError.hidden = false;
    document.querySelector("#role").focus();
    return;
  }
  if (!categories.length) {
    formError.textContent = "Choose at least one question type to build your practice set.";
    formError.hidden = false;
    form.querySelector('input[name="category"]').focus();
    return;
  }

  formError.hidden = true;
  currentQuestions = chooseQuestions(categories, count, role, programmingLanguage, resumeProvided);
  currentEvaluations = new Map();
  renderQuestions(currentQuestions);
}

function getPracticeText() {
  return currentQuestions.map((question, index) => {
    const answer = document.querySelector(`#answer-${index}`)?.value || "";
    const evaluation = currentEvaluations.get(index);
    const feedback = evaluation
      ? `\n   Assessment: ${evaluation.assessment} (${evaluation.score}/5)\n   Feedback: ${evaluation.feedback}\n   Sample answer: ${evaluation.reference_answer}`
      : "";
    return `${index + 1}. [${question.category}] ${question.prompt}\n   Follow-up: ${question.followUp}\n   Your answer: ${answer}${feedback}`;
  }).join("\n\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateQuestions();
});

questionList.addEventListener("click", (event) => {
  const button = event.target.closest(".evaluate-button");
  if (button) evaluateAnswer(button);
});

document.querySelector("#resume-file").addEventListener("change", async (event) => {
  const fileInput = event.currentTarget;
  const file = fileInput.files[0];
  if (!file) return;

  if (file.size > 1024 * 1024) {
    formError.textContent = "That file is too large. Choose a resume under 1 MB.";
    formError.hidden = false;
    fileInput.value = "";
    return;
  }

  try {
    const resumeText = await file.text();
    if (!resumeText.trim()) {
      formError.textContent = "This file appears to be empty. Choose a text or Markdown resume, or paste your highlights.";
      formError.hidden = false;
      fileInput.value = "";
      return;
    }
    document.querySelector("#resume-highlights").value = resumeText.slice(0, 8000);
    document.querySelector("#resume-file-name").textContent = file.name;
    formError.hidden = true;
  } catch {
    formError.textContent = "Couldn’t read that resume file. Try a plain text or Markdown file, or paste your highlights.";
    formError.hidden = false;
    fileInput.value = "";
  }
});

document.querySelector("#regenerate-button").addEventListener("click", generateQuestions);

document.querySelector("#copy-button").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(getPracticeText());
    button.textContent = "✓";
    button.setAttribute("aria-label", "Questions copied");
    window.setTimeout(() => {
      button.textContent = "▢";
      button.setAttribute("aria-label", "Copy questions");
    }, 1600);
  } catch {
    formError.textContent = "Couldn’t access the clipboard. Try selecting and copying the questions instead.";
    formError.hidden = false;
  }
});

document.querySelector("#download-button").addEventListener("click", () => {
  const file = new Blob([`Prepwise interview practice\n\n${getPracticeText()}\n`], {
    type: "text/plain;charset=utf-8"
  });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "prepwise-interview-questions.txt";
  link.click();
  URL.revokeObjectURL(url);
});
