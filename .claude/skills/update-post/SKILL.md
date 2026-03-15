---
name: update-post
description: Update an existing content post (journey, project, tool, or blog) with new information. Interactively confirms the target post, gathers update details from the user, and modifies the MDX file while preserving the existing structure and schema.
---

Update an existing content post on the site. Argument: optional free-text hint about which post to update and/or what to change (e.g., `/update-post add impact metrics to the MLOps project`).

## Step 1 — Identify the target post

If `$ARGUMENTS` mentions a specific post, search for it. Otherwise, ask the user which post they want to update.

Search strategy:
1. Use `Glob` to list files in the relevant content directory (`src/content/journey/`, `src/content/projects/`, `src/content/tools/`, `src/content/blog/`). If the post type is unclear, search all four.
2. Match by filename slug or by grepping frontmatter `title`/`name` fields.
3. Present the best match (or a short list of candidates) to the user and confirm with `AskUserQuestion` before proceeding.

Once confirmed, read the full file so you have the current content.

## Step 2 — Gather update details

Ask the user what they want to change or add. Keep it conversational — ask 1-3 questions at a time. Common updates include:

- Adding or revising body content
- Updating frontmatter fields (e.g., new impact metrics, updated tech stack, corrected dates)
- Adding new sections or expanding existing ones
- Changing `draft: true` to `draft: false` to publish
- Fixing errors or outdated information

If the user provides free-text information (e.g., a paragraph of context, bullet points, a link), use that as source material — don't just paste it verbatim. Integrate it into the existing post's tone and structure.

## Step 3 — Update the post

1. **Read the schema**: Check `src/content.config.ts` to confirm the exact schema for the post type, so any frontmatter changes remain valid.
2. **Read existing peers**: Skim 1-2 other posts in the same collection to stay consistent with tone and style.
3. **Apply changes**: Use the `Edit` tool to make targeted edits. Preserve existing content that isn't being changed. Key rules:
   - Keep the existing filename and location unless the user explicitly asks to rename/move.
   - Maintain valid YAML frontmatter matching the Zod schema.
   - Keep the same writing tone and structure as the original post.
   - For body content updates, integrate new information naturally — don't just append it at the end unless that's the right place for it.
   - Use ISO 8601 dates (YYYY-MM-DD) for any date fields.

## Step 4 — Validate

Run `bun run build` to verify the updated file passes schema validation. If it fails, read the error, fix the issue, and retry.

## Step 5 — Summarize changes

Show the user a brief summary of what was changed (fields updated, sections added/modified). If the post is still in draft (`draft: true`), mention that. If the user hasn't asked to publish it, leave draft status unchanged.

## Guidelines

- Always read the target file before making any changes.
- Make minimal, targeted edits — don't rewrite sections the user didn't ask to change.
- Match the tone and style of the existing post and its collection peers.
- Keep descriptions concise and authentic. Avoid marketing language.
- For projects, the `keyDecisions` format is critical: each must have `decision` and `reasoning`, with optional `alternatives` array.
- If the update is substantial (e.g., rewriting the entire body), confirm the scope with the user before proceeding.
