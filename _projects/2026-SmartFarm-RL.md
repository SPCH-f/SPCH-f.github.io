---
title: "SmartFarm RL – Autonomous Irrigation & Edge Computing"
category: "Data & AI"
stack: ["Python", "NumPy", "Socket Programming", "TCP/IP Network"]
link: "https://github.com/SPCH-f/SmartFarm_RL.git"
---
Autonomous smart greenhouse irrigation system powered by a model-free Q-Learning algorithm that dynamically transitions from raw exploration to optimized water-saving control policies. The platform maps soil moisture variables into discrete states paired with stochastic reward parameters, enabling the agent to maintain high operational scores under normal conditions while adapting to simulated environment drift and extreme heatwaves. To guarantee production-ready resilience, the pipeline integrates a rule-based safety guardrail layer that overrides AI inference under critical failure thresholds to prevent crop damage, alongside a decoupled client-server architecture using TCP/IP socket programming to emulate live edge deployment on virtual hardware without physical dependencies. Outcome: Developed an end-to-end MLOps simulation executing intelligent climate-risk mitigation and localized edge network automation.