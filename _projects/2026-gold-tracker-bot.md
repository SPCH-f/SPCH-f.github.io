---
title: "Gold-tracker-bot"
category: "Systems"
stack: ["Python", "LINE Messaging API", "Google Sheets API", "GitHub Actions"]
link: "https://github.com/SPCH-f/gold-tracker-bot.git"
---
Serverless, event-driven data pipeline written in Python that automates financial asset monitoring and programmatic broadcasting without dedicated infrastructure. The system executes automated cron-jobs via GitHub Actions to ingest live global gold indices and currency exchange metrics from the Yahoo Finance API, executing real-time data transformations to calculate domestic Thai market values. Transformed datasets are seamlessly pushed to the Google Sheets API for structured data logging while triggering technical indicator evaluation to push instant, data-driven visual summaries via the LINE Messaging API. Outcome: Engineered a resilient, zero-cost data pipeline implementing automated ingestion, statistical tracking, and multi-channel reporting.