# Retail English: UX and UI evaluation

October 2026 · app version 2.2.0 (commit `75fc789`). Line numbers refer to that commit.

## How the app was evaluated

- I read `index.html`, `css/app.css` and `js/app.js` in full, and reviewed how the content in `js/program.js` is structured.
- I ran the app in headless Chromium and went through every learner and trainer screen at 360×740 CSS px. I did this in light and dark mode, once as a new learner and once as a learner in week 2 with seeded progress. I also spot-checked 320×568, 360×640, 393×852, 412×915 and 1280×800.
- I ran axe-core 4 (WCAG 2.1 AA and best-practice rules) on 60 screens. Scripts also checked for horizontal overflow, touch targets under 44 px and text under 13 px.
- To simulate thumb use, a script worked through three activities. It tapped only what was on screen, scrolled by hand when a target was hidden, and counted those scrolls.
- For speech, the main pass simulated three English voices. I tested the "no English voice" path with Chromium's real speech engine, which has no voices. I did not test speech recognition.

## Verdict

The foundation is good. The Arabic-first layout is careful, units have a clear and predictable structure, the visual language is consistent, and automated checks are mostly clean. The problems that matter most are in three areas:

1. **The quiz loop on ordinary phones.** On 360 px-wide screens, almost every answer needs a scroll before the learner can see the feedback and reach **التالي**.
2. **Data durability.** All progress lives in browser storage, which iPhones clear after a week without a visit.
3. **The trainer area.** Learners can open it, and it shows the exit role-play scripts.

Most of the fixes are small.

## What works well

- **RTL done right.** English is isolated with `dir="ltr"` and `<bdi>`. Chevrons and the toggle switch mirror correctly. IBM Plex Sans Arabic and Plex Sans pair well.
- **A predictable unit structure.** Each unit has nine steps, and each step has a one-line purpose and a time estimate. The unit page has a start/continue button and highlights the current step.
- **Immediate feedback.** Every answer shows the correct answer, its English text and its Arabic meaning.
- **Clean automated results:**
  - no horizontal overflow at any width down to 320 px
  - no axe contrast failures in light or dark mode
  - every learner touch target is at least 44 px
- **A helpful no-voice path.** It explains how to install an English voice on Android and iPhone instead of failing silently.
- **Platform support:** dark mode, reduced motion and offline use.

## Findings

| # | Priority | Finding | Effort |
|---|---|---|---|
| 1 | High | Quiz feedback and **التالي** fall below the fold on common phones | S |
| 2 | High | Unit-check results open half-scrolled, and a learner who failed sees a survey before any way to recover | S |
| 3 | High | Progress can silently disappear, because it is kept only in browser storage | M |
| 4 | High | Learners can open the trainer area, including the exit role-play scripts | S–M |
| 5 | Medium | A teal outline frames the whole screen on first open and during keyboard use | XS |
| 6 | Medium | The app never asks for the learner's name, so the shared record says "—" | S |
| 7 | Medium | Learners can copy the dialogue-ordering task from the transcript above it | S |
| 8 | Medium | Lessons carry too much chrome, Back steps through history, and leaving a quiz discards it silently | M |
| 9 | Medium | The step-progress strip barely shows which steps are done | XS |
| 10 | Medium | English sentences inside Arabic text break across lines | S |
| 11 | Medium | Home doesn't highlight the next action or show the daily goal | S |
| 12 | Medium | The listening check spends one of its two plays automatically and has no "don't know" option | S |
| 13 | Low | Accessibility gaps found by axe | S |
| 14 | Low | Arabic plural forms | XS |
| 15 | Low | Smaller polish items | XS |

### 1. Quiz feedback and التالي fall below the fold

**What happens.**

- After an answer, the feedback and the **التالي** button are added below the options (`js/app.js:1427-1430`).
- The button is focused with `preventScroll: true`, so the page does not scroll.
- A new question does not reset the scroll position either (`runQuiz`, `js/app.js:1358`).

**Evidence.** In the thumb simulation, these are the manual scrolls needed to finish each activity:

| Visible viewport | Understand the customer (8 items) | Unit check (10) | Key phrases (13) |
|---|---|---|---|
| 360×640 | 8 | 10 | 2 |
| 360×740 | 8 | 9 | 2 |
| 393×852 | 8 | 3 | 0 |
| 412×915 | 0 | 0 | 0 |

A 360×640 viewport is roughly what a 360×800 Android phone shows in Chrome while the address bar is visible. At that size, the top of the question card was also hidden under the app bar on 7 of 8 new questions.

<img src="ux-eval/quiz-answered-360x740.webp" width="270" alt="An answered question at 360×740: the options are marked, but the feedback and the Next button are hidden under the tab bar">

**Fix.**

- **Quick fix:** after an answer, call `$('#qnext', host).scrollIntoView({ block: 'nearest', behavior: 'smooth' })`, and start each `draw()` with `window.scrollTo(0, 0)`. Do the same in `lcRunner`, `viewNumbers` and the review deck.
- **Better fix:** add an answer bar holding the feedback and **التالي** that slides up in place of the tab bar during activities (see #8).

### 2. Unit-check results open half-scrolled

**What happens.**

- `finish()` (`js/app.js:1728`) swaps in the results but keeps the quiz's scroll position, so the results open with the score cut off.
- Below the score come the mistakes and then the unit pulse survey.
- **أعد الاختبار** and **راجع العبارات** are at the very bottom, under the survey. A learner who just failed has to get past the feedback form before reaching any way to recover.

<img src="ux-eval/check-result-360x740.webp" width="270" alt="Unit check results opening with the score cut off and the survey in the middle of the screen">

**Fix.**

1. Scroll to the top when the results appear.
2. Put the next action directly under the score: **التالي** after a pass, or **راجع العبارات** and **أعد الاختبار** after a fail.
3. Show the mistakes after that.
4. Make the pulse a short optional card at the end.

### 3. Progress can silently disappear

**What happens.** All progress is kept in `localStorage` (`js/app.js:281-292`), which causes four problems:

- **Safari on iPhone clears it.** Safari deletes a site's stored data after seven days of Safari use without a visit to that site. Apps added to the Home Screen are exempt. One missed week in a six-week program can erase everything, and the app never suggests installing it on iPhone or Android.
- **Chrome can evict it.** The app never calls `navigator.storage.persist()`, so Chrome can evict the data when the device runs low on storage.
- **Save failures are silent.** `save()` swallows errors (`js/app.js:290`). If storage is full or blocked, the learner keeps working and the work is lost.
- **Export is hidden.** Export exists, but only in Settings.

**Fix.**

- Add an install card on Home and show it until the app runs installed (`display-mode: standalone`):
  - on Android, use the `beforeinstallprompt` event
  - on iPhone, show the Share › Add to Home Screen steps
- Call `navigator.storage.persist()` after the first completed step.
- Warn once when a save fails.
- Prompt weekly to send the learning record to the trainer. If the record includes the JSON export, it also works as a backup.

### 4. Learners can open the trainer area

**What happens.**

- Settings › **للمدربين وفريق البرنامج** (`js/app.js:2339`) is open to everyone.
- **بطاقات لعب الأدوار** shows the three exit role-plays (X1–X3), with every customer line and a play button for each (`js/app.js:2583-2606`).
- The README says the exit role-plays use material that isn't rehearsed in the units. Today, any learner can rehearse them word for word.
- Learners can also add role-play ratings and alignment reviews.

<img src="ux-eval/trainer-cards.webp" width="270" alt="The role-play cards page, reachable from learner Settings">

**Fix.** Remove the link from learner Settings and put the trainer area behind a code, even a fixed one shared at the trainer briefing. A code in a static app only stops casual browsing, so the sturdier fix is to keep the X1–X3 scripts out of the learner app entirely, for example on a trainer-only page.

### 5. A teal outline frames the whole screen

**What happens.** After each render, the app focuses `<main tabindex="-1">` (`js/app.js:887`). The global `:focus-visible` rule (`css/app.css:111`) then draws a 3 px teal outline around the whole content area. Chrome treats focus as visible on first load and after keyboard use. As a result, learners see this frame whenever they open or reload the app, and keyboard users see it on every screen.

<img src="ux-eval/focus-ring-desktop.webp" width="480" alt="Desktop view with a teal outline around the whole content column">

**Fix.** Add `#view:focus { outline: none; }`. The main region is a programmatic focus target, not a control.

### 6. The app never asks for the learner's name

**What happens.** The name and store fields exist only in Settings (`js/app.js:2319`). The learning record, which learners are told to show their trainer, therefore prints **المتدرب —** (`js/app.js:2202`). So does the shared text (`js/app.js:2174`).

**Fix.** Ask once, as an optional question with a skip, on first open. Alternatively, ask when the learner opens the record or taps **مشاركة** without a name set.

### 7. The ordering task can be copied

**What happens.** In step 2, the full transcript, in English and Arabic, stays on screen directly above **رتّب الحوار** (`js/app.js:1254-1275`). Learners can scroll up and copy the order, so the task doesn't test listening. The page is also about 3.4 screens long at 360 px.

<img src="ux-eval/model-order-task.webp" width="270" alt="The ordering task directly under the transcript">

**Fix.** When ordering starts, collapse the transcript into an audio-only player that can play the whole dialogue or replay a line. Show the text once the task is done.

### 8. Lesson chrome and navigation

**What happens.**

- **Little space for the activity.** Inside a step, 166–265 px of app bar, step strip, step line and item counter sit above the activity, with the 64 px tab bar below it. On a 640 px-tall viewport that leaves about 310–410 px for the activity.
- **Back steps through history.** The back arrow returns through every step visited (`goBack`, `js/app.js:889`), not up to the unit page.
- **No warning on exit.** Leaving partway through, by back or by a tab, discards a half-done unit check, role-play or speed round without warning.

**Fix.** Add a focused lesson mode:

- hide the tab bar inside `unit/:u/:step`
- replace the back arrow with **×**, which returns to the unit page
- ask for confirmation before discarding an activity in progress

### 9. The step strip barely shows progress

**What happens.** The strip colours each step by its position, not by whether it is complete (`js/app.js:1183-1185`). Steps already passed use `#e1f0ed` and steps still ahead use `#eeece4`. These two colours have a contrast ratio of 1.01:1, and each has 1.07:1 against the page background, so they look the same. WCAG 1.4.11 asks for 3:1 for graphics that carry meaning. All progress bars use the same faint track.

**Fix.**

- Colour each step by completion:
  - **done:** `--brand`
  - **current:** outlined
  - **to do:** a darker grey
- Darken the track.

### 10. English sentences inside Arabic text break across lines

**What happens.**

- **Missions.** Three missions place whole English sentences inside Arabic text (`js/program.js:409`, `505`, `790`). When a sentence wraps, its first half sits at the left end of one line and its second half at the right end of the next. The README's own content rule says to keep English sentences out of Arabic text.
- **Home previews.** `preview()` strips the backticks (`js/app.js:690`), which removes the direction isolation, so the ellipsis lands on the wrong side ("…Let me show you").
- **Trainer hub.** The titles break the same way: "Role-" ends one line and "play cards" starts the next (`js/app.js:2419-2425`).

<img src="ux-eval/mission-bidi.webp" width="330" alt="Unit 1 mission: the English sentence split across two lines of Arabic text">

**Fix.**

- Move the sentences into a list shown as tap-to-hear lines, like the Watch-out items.
- Give each mission a short Arabic-only summary for Home.
- Put the English trainer titles on their own line.

### 11. Home doesn't highlight the next action

**What happens.**

- Every Home card has the same visual weight, so **تابع من حيث توقفت** looks no different from the review and mission cards beside it.
- Unlike the unit page, the Home hero has no button.
- The program asks for about 20 minutes a day, but Home only shows **دقيقة هذا الأسبوع**, with no target. The target appears only on the Progress tab.

<img src="ux-eval/home-week2.webp" width="270" alt="Home in week 2: three cards of equal weight, with the mission preview's ellipsis on the wrong side">

**Fix.**

- Add a **تابع** button to the hero, as on the unit page.
- Show progress against the target, either "اليوم: 12 / 20 دقيقة" or this week's minutes against 120.

### 12. The listening check plays automatically and has no "don't know" option

**What happens.**

- Each item plays as soon as it appears, and that play counts as one of the two allowed (`js/app.js:1012-1019`).
- The first item therefore opens with **يمكنك الاستماع مرة أخرى**. A learner who wasn't ready gets only one real listen.
- Price items can't be skipped (`js/app.js:1004`). A learner who heard nothing has to make up a number, which adds noise to a diagnostic.

**Fix.**

- Don't auto-play in the check, or don't count the automatic play.
- Add a **لا أعرف** option.

### 13. Accessibility gaps found by axe

| Issue | Where | Fix |
|---|---|---|
| No screen has an `<h1>`; the screen title is a `<div>` | `index.html:23` | Make `#barTitle` an `h1` |
| Progress bars have no accessible name (86 instances on 27 screens) | `js/app.js:703` | Add an `aria-label` |
| `.step-progress` puts `aria-label` on a plain `div` | `js/app.js:1183` | Add `role="img"`, or make it a progress bar |
| The 21 audio buttons on the trainer role-play cards have no text label and are 36×28 px | `js/app.js:2598` | Add labels and enlarge them |
| `.table-scroll` regions can't be reached by keyboard | `css/app.css:551` (class) | Add `tabindex="0"` and a label |
| The bottom sheet doesn't keep focus inside while open | `js/app.js:543` | Trap focus in the sheet |

### 14. Arabic plural forms

Counts above one always use the same plural form, which is often wrong:

| Shown | Correct |
|---|---|
| 2 عبارات | عبارتان |
| 15 عبارات | 15 عبارة |
| (2 محاولتان) | (محاولتان) |
| 9 يومًا | 9 أيام |

These strings are at `js/app.js:940`, `1994`, `2148` and `2214`. `Intl.PluralRules('ar')` returns the right category for each count (zero, one, two, few, many or other).

### 15. Smaller polish items

- **Naming:** quick phrases goes by three names, **عبارات سريعة** on the tab and the sheet, and **مساعدة سريعة** and **عبارات الطوارئ** on the Practice tile (`js/app.js:1833-1836`).
- **Showing phrases to customers:** the quick-phrases sheet says **اعرضها للعميل**, but there is no large-text view for turning the phone toward a customer. A tap-to-enlarge, full-screen phrase would make that work.
- **Numbers subtitle:** the header subtitle stays **اسمع السعر واكتبه** in all three modes (`js/app.js:1841`).
- **Review deck:** **سهلة** is the only filled button, which nudges learners to grade themselves "easy" (`js/app.js:2017-2021`). Give the three grades equal weight.
- **Sticky hover:** hover borders stay on after a tap on touch screens (`css/app.css:185`, `240`, `333`, `373`, `422`, `529`). Wrap the hover rules in `@media (hover: hover)`.
- **Tab labels:** they are 12.5 px, the only text under 13 px (`css/app.css:159`), and **عبارات سريعة** wraps onto two lines at 320 px.

## Beyond the interface

The entry and exit listening checks use the phone's speech voices. The same test therefore sounds different from phone to phone, and some phones play nothing at all. Since the check is a pre/post measure, recording audio for its 20 items would make scores comparable across learners.

## Suggested order

1. **Quick fixes:** #5, #1 (quick version), #2, #9 and #14.
2. **Before the pilot:** #3, #4, #6 and #12.
3. **Next iteration:** #8 (lesson mode), #7, #10, #11, #13 and #15.
