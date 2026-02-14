---
name: get-trending-repo
description: Fetch this week's trending GitHub repos and recommend the top 3 most relevant to your interests (AI/ML, data science, developer tools, LLMs, vector databases, Python/Rust tooling).
---

Surface the most interesting trending GitHub repos for this week based on the site owner's interests.

## Step 1 — Fetch trending repos

Use `WebFetch` to retrieve the GitHub trending page (weekly):

- URL: `https://github.com/trending?since=weekly`
- Extract: repo name, owner, description, language, stars gained this week, and total stars

## Step 2 — Filter out already-reviewed tools

Read the tool names from `src/content/tools/*.mdx` (extract the `name` field from each file's frontmatter). Exclude any trending repo that matches or closely corresponds to a tool already reviewed on the site. For example, if "Ollama" is already reviewed, skip `ollama/ollama` from the trending list.

## Step 3 — Build interest profile

The site owner is a **data scientist specializing in AI-driven interdisciplinary research**. Key interest areas (derived from existing tools and projects):

| Category | Keywords / signals |
|---|---|
| **AI / ML / LLMs** | LLM inference, RAG, vector databases, model serving, fine-tuning, agents, multi-modal AI |
| **Data science** | data pipelines, NLP, text mining, meta-analysis, research tooling |
| **Developer tools** | code editors, AI coding assistants, CLI tools, package managers |
| **Infrastructure** | Docker, dev containers, networking, self-hosting, deployment |
| **Python ecosystem** | Python tooling, Rust-based Python tools (uv, pixi, ruff), reproducibility |
| **Knowledge management** | note-taking, PKM, structured information |

Repos that overlap with multiple categories are stronger matches.

## Step 4 — Rank and select top 3

From the trending list, pick the **3 repos** most relevant to the interest profile above. Prioritize:

1. **Relevance** — direct match to interest categories
2. **Novelty** — prefer repos the user likely hasn't seen (not already in their tools/projects)
3. **Quality signals** — high star velocity, clear documentation, active maintenance

If `$ARGUMENTS` is provided, use it as an additional filter or focus area (e.g., `/get-trending-repo rust` would bias toward Rust repos).

## Step 5 — Present recommendations

For each of the 3 repos, present:

```
### {rank}. {owner}/{repo-name}

{1-2 sentence summary of what it does and why it's relevant to you}

- **Language:** {primary language}
- **Stars this week:** {weekly stars}
- **Link:** https://github.com/{owner}/{repo-name}
```

End with a brief note if any trending repos nearly made the cut but were slightly outside the interest profile — mention them in one line as honorable mentions.
