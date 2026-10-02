# Retail English

The app is the digital part of **English for Retail Sales Associates**, a six-week blended program for Saudi retail staff (CEFR A1–A2) who serve English-speaking customers. Each week has three parts:

- a 2-hour workshop
- about 20 minutes a day of app practice
- one mission done at work

The app is a static web app with no build step and no server. It is Arabic-first and works offline after the first visit.

## How the app maps to the program design

The design follows Macalister and Nation's (2020) curriculum design model. Every part of the model has a place in the app, and the trainer area (**Settings › للمدربين**) shows the full design.

| Design component | Where it lives in the app |
|---|---|
| Environment analysis | Arabic interface, short steps for shift workers, offline use, and a workshop guide for trainers who are new to the course (**Trainer › Program design**) |
| Needs analysis | The units follow the target situation, the service encounter, rather than grammar lists |
| Principles | **Four strands**: every unit's steps are labelled input, output, language focus or fluency.<br>**Spaced retrieval**: a daily review deck.<br>**Interference**: Watch Out notes and practice with 13/30-type number pairs.<br>**Time on task**: study minutes are tracked.<br>**Feedback**: immediate feedback on every item. |
| Goals | Six program learning outcomes (PLOs). Each one is written together with the task that assesses it (**Units › مخرجات البرنامج** and **Trainer › Alignment matrix**) |
| Content and sequencing | Six weekly units, ordered by the stages of the service encounter: welcome, finding products, products and prices, checkout, returns, complaints |
| Format and presentation | A genre-based, text-based syllabus. Each unit runs the teaching-learning cycle: building the field, modelling and deconstruction, joint construction, then independent construction. Support is withdrawn step by step. |
| Monitoring and assessment | **Diagnostic**: a role-play in Week 1.<br>**Listening check**: entry and exit forms.<br>**Formative**: unit checks with an 80% pass mark, plus mission logs.<br>**Summative**: three exit role-plays, scored by two raters on the same four criteria as the diagnostic. |
| Evaluation | The evaluation plan (who is asked, with what, and when) is set up from the start. Data sources are unit pulse ratings, the end-of-program survey, exported learner records, rater agreement, and a two-reviewer alignment check that runs before the pilot. |

### The nine steps in each unit

| Step | Teaching-learning cycle | Strand (Nation) |
|---|---|---|
| 1. Context and words | Building the field | Language-focused learning |
| 2. Model conversation and stage ordering | Modelling and deconstruction | Meaning-focused input |
| 3. Key phrases, added to the review deck | Modelling | Language-focused learning |
| 4. Understand the customer, with mixed English accents | Modelling | Meaning-focused input |
| 5. Build the conversation, choosing each line | Joint construction | Meaning-focused output |
| 6. Role-play with only an Arabic cue; optional microphone check | Independent construction | Meaning-focused output |
| 7. 60-second speed round on familiar material | Independent construction | Fluency development |
| 8. Unit check and unit pulse | Checking learning | Formative assessment |
| 9. Mission at work, with a log | Transfer to work | Meaning-focused output |

### Assessment and alignment

- **Spoken outcomes are assessed by performance only.** Multiple-choice items alone never decide whether an outcome is met. The in-app checks are formative.
- **The exit role-plays use new material.** Their products and problems are not rehearsed in the units, so the exit measure does not depend on the exact sentences taught.
- **Trainer › Rate a role-play** records two independent raters on the four criteria. It flags gaps of more than one point and reports exact and within-one agreement. It also compares each learner's diagnostic and exit scores, and exports the ratings as CSV.
- **Trainer › Alignment check** supports the pre-pilot check. Two reviewers each map the exit tasks to the outcomes on their own, and the app reports percent agreement and Cohen's kappa. It also compares each reviewer with the design matrix.

## Check these against your program document

The app's content comes from `js/program.js`. These values were drafted for this revision, so make sure they match your final design:

1. **The four role-play criteria.** They are in `rubric.criteria` and are currently task completion, understanding and interaction, service language, and clarity and fluency. Replace them with the diagnostic's own four criteria.
2. **Program length.** It is set to `weeks: 6` and `hours: 30`, with each week split 2 + 2 + 1 hours (`meta.weeklyPattern`).
3. **Outcome wording**, in `outcomes`.
4. **Pass rules:**
   - Role-plays pass at a mean total of at least 12 out of 16, with no criterion mean below 2. These values are `rubric.passTotal` and `rubric.minCriterion`.
   - Unit checks pass at 80% (`meta.passMark`).
5. **Credits.** `meta.designer` and `meta.context` are blank. Fill them in to show your name and the course on the design page.

## Editing content

Everything the app shows is defined in `js/program.js`, and no other file needs to change. Inside each unit:

- `phrases` holds the customer lines and the learner's replies:
  - `c` is the customer's line in two variants; `cAr` is its Arabic translation.
  - `k` is the reply; `kAr` is its Arabic translation.
- `model` is the model conversation. Each line's `st` value names its genre stage.
- `roleplay` is the conversation used for the build and role-play steps.
- `workshop` holds the trainer's notes.
- `mission` is the task done at work.

In Arabic text, wrap English words in backticks (`` `like this` ``) so they display left to right inside the sentence.

Three phrase tags keep the auto-generated wrong answers clearly wrong:

- `f` is a function group. Replies in the same group are never offered as distractors for each other.
- `gen` marks a generic reply that is never used as a distractor.
- `noR` keeps a phrase out of "choose the reply" items.

## Running and deploying

- **Locally:** open `index.html`, or serve the folder with `python3 -m http.server` and visit `http://localhost:8000`. Offline caching only works over http(s).
- **GitHub Pages:** go to Settings › Pages and deploy from the branch root.
- **After changing files:** bump `CACHE` in `sw.js` so that installed copies pick up the update.

## Data and privacy

Progress is stored only in the browser on the learner's device (`localStorage`). There is no server, no account and no analytics. Learners can share or print their learning record, and both learners and trainers can export JSON. Trainer ratings export as CSV.

## Browser notes

- **Voices:** speech uses the voices installed on the device. The "mixed accents" setting rotates through whichever English voices are available, such as Indian, British, Australian and US.
- **Microphone practice:** this is optional. It uses the browser's speech recognition, which Chrome and Safari provide. In Chrome it needs an internet connection.

## References

- Biggs, J. (1996). Enhancing teaching through constructive alignment. *Higher Education, 32*(3), 347–364.
- Feez, S. (1998). *Text-based syllabus design*. NCELTR, Macquarie University.
- Hasan, R. (1985). The structure of a text. In M. A. K. Halliday & R. Hasan, *Language, context, and text* (pp. 52–69). Deakin University Press.
- Hutchinson, T., & Waters, A. (1987). *English for specific purposes: A learning-centred approach*. Cambridge University Press.
- Macalister, J., & Nation, I. S. P. (2020). *Language curriculum design* (2nd ed.). Routledge.
