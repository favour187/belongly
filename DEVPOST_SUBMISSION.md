# Belongly — Devpost Submission (Copy-Paste Ready)
**Hackathon:** CSC Winter Sparkathon 2026 · Theme: technology that brings people together or helps people support one another
**Deadline:** Nov 30, 2026 @ 12:00am PST — opt in to the CSC Innovation Award + make the project public/open-source to be prize-eligible.

## Project Name
Belongly

## Tagline
Nobody should have to start over alone. Belongly matches newcomers anywhere in the world with a verified local buddy, a First-30-Days journey, and a community that answers back.

## The Problem (Global)
Loneliness is now a global public-health crisis. The **WHO Commission on Social Connection (June 2025)** found that **1 in 6 people worldwide feels lonely**, linked to an estimated **871,000 deaths per year** (~100 every hour), with the highest rates among teenagers and young people (17–21% of 13–29-year-olds) — "even in a digitally connected world, many young people feel alone." At the same time, **281 million people live outside their country of birth** and **117.3 million people were forcibly displaced** (UNHCR) — and millions more students change school, city or neighbourhood every single year. Every one of them faces the same brutal window: **the first 30 days somewhere new**, when you know no one, can't ask "silly" questions, eat lunch alone, and don't know which door to knock on. Social media connects us to everyone we've ever met — and no one in the place we actually are.

## What Belongly Does
Belongly is a web app that makes sure nobody faces their first 30 days alone. It has one structured system, not another open chat feed:

1. **BuddyMatch (transparent algorithm)** — Newcomers set where they've landed, languages they speak, and things they love. Belongly scores every verified local buddy: same city/school (35pts) + shared languages (up to 30pts) + shared interests (up to 25pts) + free this week (10pts). Users see the exact percentage **and the reasons** — and when they edit their profile, every score recalculates live. No black box.
2. **The First-30-Days Journey** — A 4-week quest path (Land Softly → Learn the Ropes → Find Your People → Feel At Home) designed to be completed *with* your buddy: first in-person hello in a public place, mastering one bus route together, joining one club, teaching your buddy a recipe from home, and finally writing "Advice to Day-1 Me" for the next newcomer. Progress, points and badges make belonging feel achievable, one small win at a time.
3. **Ask a Local** — A moderated Q&A board per city ("How do student bus passes work here?" "Which clubs welcome total beginners?"). Anyone can answer; helpful answers are upvoted. Today's newcomer becomes tomorrow's local.
4. **AI Icebreaker + Phrase Card** — Opening a match generates a personalised first hello (from your shared interests, city and match score) plus 5 essential phrases in your buddy's language (Spanish, Ukrainian, Arabic, French, Mandarin, Portuguese, Yoruba, English). It runs on a built-in phrase engine today and is architected to plug into **Backboard.io's Unified API** (sponsor, $10 credits with code SPARKATHON) via a Cloudflare Worker, so the API key stays server-side and out of the public frontend.
5. **Connection Circles** — Small groups (max 12) meeting in public around one shared love — Saturday football, Cook Your Country, Two-Language Book Club — the bridge from "I know one person" to "I have my people."

**Safety is the product:** verified buddies only (via schools/libraries/community orgs) · public first meetings only · first names + city only, no private data · one-tap report & block · trusted-adult visibility for under-18s · per-city moderation.

## How We Built It
A single-page web app in **HTML, CSS and vanilla JavaScript** (zero dependencies, no build step): a sidebar app shell with six views (Dashboard, Find My Buddy, Journey, Ask a Local, Circles, Safety); a live matching engine that scores and ranks buddies from editable user preferences with a full score breakdown; a quest system with progress + badges persisted in `localStorage`; a working Q&A board (post, answer, helpful votes, category filters); joinable Circles with live member counts; and a simulated global activity feed. Fully responsive and mobile-first, because newcomers live on their phones.

## Tools & Resources Used
- HTML5, CSS3, vanilla JavaScript (state, rendering, localStorage)
- AI assistant (Arena AI) — see disclosure below
- Sponsor resource identified for the live-AI upgrade: Backboard.io Unified API ($10 participant credits, code SPARKATHON) — integration is designed (server-side via Cloudflare Worker) and the feature already works with a built-in phrase engine, so the demo never depends on an API key
- Statistics & sources: WHO Commission on Social Connection global report (June 30, 2025, who.int); UN/UNHCR Global Trends — international migrants & forced displacement (inee.org/collections/forced-displacement, UNHCR)
- No external libraries/APIs. All demo profiles, questions and feed items are fictional.

## AI-Use Disclosure (copy into Devpost)
> We used an AI assistant (Arena AI) to brainstorm, generate initial code, and help draft copy and this submission — as allowed and encouraged by this hackathon, disclosed in full. The human team chose the global problem (loneliness and newcomer isolation, evidenced by the WHO's 2025 report), designed the BuddyMatch scoring algorithm, the First-30-Days Journey and the safety model, selected and cited all statistics, reviewed and tested every feature, and can explain how every part of the app works. No real user data was collected; all demo profiles are fictional.

## What We Learned
- That "loneliness" only becomes buildable when you shrink it to a concrete window — **the first 30 days** — and a concrete unit: **one buddy, one quest at a time**.
- Transparent algorithms build trust: showing *why* you were matched (and letting users change the inputs and watch scores move) matters as much as the score.
- Safety can't be a settings page; it has to shape the features themselves (public-first-meetup suggestions, verification badges, no private data fields at all).
- Gamification works when the reward is real belonging — Roots and badges are just receipts for things that actually happened in real life.

## Challenges
- Making matching feel human, not dating-app-like (solved: buddy framing, quest-first contact, suggested public meetups, no swiping).
- Balancing global scale with local trust (solved: verification is always local — a school, library or community org in your city).

## What's Next
Real accounts + organisation verification flow · city launch kits for schools/libraries · journey translations (Spanish, Ukrainian, Arabic, Yoruba, French, Mandarin) · mentor dashboards for schools · partnerships with refugee & exchange-student organisations · native mobile app.

## Team
[REPLACE: your name(s), up to 4 members, all students aged 13–18]

## Submission Checklist
- [ ] Start a project on the CSC Winter Sparkathon Devpost (you're already registered)
- [ ] Paste name, tagline, problem, what it does, tools, AI disclosure (above)
- [ ] Demo link: https://belongly-dnm.pages.dev
- [ ] Public GitHub repo: https://github.com/favour187/belongly (required for CSC Innovation Award eligibility)
- [ ] 3–5 screenshots: Dashboard, BuddyMatch scores, Journey, Ask a Local, Safety
- [ ] 1–2 min demo video (see DEMO_SCRIPT.md) — optional but strongly encouraged
- [ ] **Opt in** to CSC Innovation Award / Honorable Mention
- [ ] Submit before **Nov 30, 2026 @ 12:00am PST**
