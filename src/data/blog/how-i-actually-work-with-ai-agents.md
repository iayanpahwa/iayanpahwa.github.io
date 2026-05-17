---
title: "How I actually work with AI agents"
author: "Ayan Pahwa"
pubDatetime: 2026-05-17T09:00:00.000Z
description: "The rules I actually follow when working with AI agents — where things stand today, and why some of this will change."
tags: ["ai", "agentic-coding", "productivity", "workflow"]
featured: true
draft: false
---

I have been running agentic coding setups long enough to form opinions. These are not tips from a YouTube video. They are the rules I actually follow, arrived at mostly by doing the opposite first.

The field is moving fast. Some of this will age out — I am certain of it. But this is where things stand for me today, and sharing something honest and time-stamped is more useful than waiting for a consensus that is not coming.

No fluff. Each one earns its place.

---

**1. Plan before you touch anything.**
Every session starts in plan mode. No exceptions, no "it's a small change." High-confidence execution in the wrong direction is the most expensive failure mode in agentic coding, and it is completely avoidable.

**2. One session, one thing.**
Each agent session has exactly one job. When it's done, I update my CLAUDE.md with anything I learned, then start fresh for the next task. Focus, context window, and cost — all three improve at once. Starting fresh is not a limitation; it is the workflow. And for a genuinely new project, no CLAUDE.md at all is sometimes the right call — no assumptions carried over, no patterns borrowed from the last codebase. The agent starts clean because you do, and that is a feature.

**3. Metrics, not vibes.**
Before running the agent, I define a concrete, measurable target. Field fill rate above 95%. Zero errors on 100 test URLs. The agent loops until the metric is hit, not until the code "looks right." Looks right is not a criterion.

**4. Specialise your agents.**
A general-purpose agent doing everything is nobody's best choice. Give each agent one role, one model, and one permission scope. My architect plans, my coder executes, my reviewer reviews. None of them do each other's job.

**5. Permissions match responsibility.**
Read-only agents get read-only access. Every time. Limiting blast radius is not paranoia — it is basic engineering. The agent that cannot run shell commands cannot accidentally delete your database.

**6. Focus over scale.**
I work on two or three projects at a time. Four concurrent agents is my ceiling. Beyond that, I am not being productive — I am just generating noise and calling it parallelism. The right number is the one where you still know what every agent is doing and why.

**7. CLI over MCP, always.**
I reach for a CLI tool first. MCP server only if there is genuinely no CLI equivalent. Every MCP invocation is an extra round-trip, extra tokens, and one more thing to debug when something goes wrong. I am team CLI and I am not apologising for it.

**8. Two tools, different jobs.**
My primary tool handles real work. My experimentation layer handles new models and overflow. That is not redundancy — that is separation of concerns. One stretched tool doing both poorly is worse than two tools each doing one thing well.

**9. Cost visibility is discipline.**
Pay-per-usage only works if you are watching the meter. I check my spend regularly, especially after heavier sessions. If you cannot see what you are spending, you are not controlling it.

**10. Keep model flexibility.**
Never lock into one provider. Your setup should let you swap models with a single config change. The market is moving fast enough that the best model today will not be the best model in six months.

**11. Anything done twice becomes a skill.**
If I have prompted an agent through the same process more than once, it gets a skill file. The overhead of writing one is low. The compounding return is not.

**12. One skill, one job — then stack them.**
A skill that does three things is three skills waiting to be separated. Single-purpose skills are debuggable and swappable. Stack them in sequence to build a workflow. Research the topic, write the script, suggest the title — each its own skill, combined in order. The composition beats the monolith every time.

**13. Bundle your tools with your skills.**
If a skill depends on a helper script, it lives in the same directory. Skills that carry their dependencies stay portable. Skills that rely on something scattered elsewhere become fragile the moment you switch machines.

**14. Knowing what is underneath is the unfair advantage.**
Agentic tools amplify judgment. They do not supply it. The developers who get the most out of these tools are the ones who understand what is actually happening at the layer below. That systems-level knowledge is what lets you catch a confident agent going wrong before it compounds.

**15. Speak your prompts, do not type them.**
Spoken prompts consistently outperform typed ones for me. Speaking forces full sentences, full sentences force complete thinking, and complete thinking produces a better brief. Try dictating your next plan mode session and compare the output.

**16. Stop obsessing over prompts.**
Models are meaningfully smarter than they were a year ago and will be smarter again next year. A clear, complete description of what you want is almost always enough now. The energy spent on prompt engineering is better spent on building skills and improving workflow. Those compound. Prompt tricks do not.

---

That is where things stand today. Not a framework, not a methodology — just what has worked, tested against real projects and a fair number of sessions where the agent was very confident and very wrong.

Some of these will age badly. The models will get smarter, the tooling will consolidate, and a few of these rules will look obvious in retrospect. That is fine. The goal is not timeless wisdom — it is actionable judgment in the current moment. And in this moment, these are the calls I would make again.
