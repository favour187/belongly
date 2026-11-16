# 🌱 Belongly

**Live app:** https://belongly-dnm.pages.dev · **Code:** https://github.com/favour187/belongly — Nobody Should Have to Start Over Alone

A web app that matches newcomers **anywhere in the world** with a verified local buddy, a structured **First-30-Days Journey**, an **Ask-a-Local** board, and **Connection Circles**. Built for the **CSC Winter Sparkathon 2026** (technology that brings people together / helps people support one another).

## The global problem
- **1 in 6 people worldwide feels lonely**, linked to ~871,000 deaths/year — [WHO Commission on Social Connection, 2025](https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death)
- **281M international migrants**, **117.3M forcibly displaced** — [UN/UNHCR](https://inee.org/collections/forced-displacement)
- The loneliest window everywhere is the **first 30 days** somewhere new. Belongly makes sure nobody faces it alone.

## Features
- **BuddyMatch** — transparent scoring (city 35 · languages ≤30 · interests ≤25 · availability 10), recalculated live as you edit your profile, with full "why" breakdowns
- **First-30-Days Journey** — 12 quests over 4 weeks, points & badges, saved in localStorage
- **Ask a Local** — post/answer/upvote local questions, category filters
- **Connection Circles** — small public meetup groups you can join
- **Safety by design** — verified buddies, public first meetings, no private data, report/block, trusted-adult visibility

## Run it
No build step — open `index.html`, or:
```bash
python3 -m http.server 8000
```
Deploy free: Netlify Drop, GitHub Pages, or Vercel (drag the folder / import repo).

## Tech
HTML5 · CSS3 · Vanilla JavaScript — zero dependencies, works offline.

## AI-use disclosure
Brainstormed, designed and coded with help from an AI assistant (Arena AI), as allowed & encouraged by the hackathon. The human team chose the problem, designed the matching algorithm, journey and safety model, cited all statistics, reviewed/tested all code, and can explain every part. Demo profiles are fictional; no real data collected.

MIT licensed. 🌱
