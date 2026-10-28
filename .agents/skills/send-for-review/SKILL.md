---
name: send-for-review
description: Publish the current feature branch as a GitHub PR and arrange local follow-up of Codex review findings. Use when the user asks to send changes for review, including «Отправь изменения на ревью», or to resume this workflow for an existing PR.
---

# Send changes for review

## Scope and authorization

For this project, an explicit request to send changes for review authorizes relevant checks, a scoped commit, a normal push to the feature branch, creating or reusing its PR, and creating or reusing review monitoring. Merely discussing the workflow does not authorize publication. Do not merge, force-push, post review-trigger comments, resolve discussions, or apply review fixes without separate authorization. Do not include unrelated work or secrets.

## Publish or reuse the PR

1. Read repository instructions. Inspect the current branch, worktree, remote and default branch. Never publish directly to the default branch. If changes have mixed ownership or unclear scope, clarify before committing them.
2. Run `npm run format:check` and relevant existing behavioral tests. Use `npm run format` if formatting is needed, and inspect its diff. Fix relevant failures or report the blocker rather than publishing knowingly failing checks without explicit user direction.
3. Commit only the intended changes with a concise, ordinary message. If already committed, do not create an empty commit. Push normally to the feature branch, setting upstream when needed; do not overwrite remote changes.
4. Prefer connected GitHub tools; use GitHub CLI only if available and authenticated. Find an open PR by exact base repository, head owner and head branch. Reuse it; do not create a duplicate. If a matching PR was closed or merged, ask before reopening or creating another one. Otherwise create a ready-for-review PR against the verified default branch, with a concise title, behavior summary, limitations and actual validation. Honor explicit requests for a draft.
5. Attach the PR to this chat using `attach_artifact` when available. Record its URL, number, repository, current head SHA and the absolute checkout path.

The existing CI runs lint/Prettier and then posts `@codex review` using a repository secret. Do not post a second trigger locally. If CI fails, report that review has not yet been requested. Do not put tokens into skill files or automation prompts.

## Arrange local review follow-up

Read [references/review-monitor.md](references/review-monitor.md) and build a concrete monitoring prompt by replacing the repository, PR number, source branch, checkout and expiry with verified values. Pin a single PR; never monitor the whole account.

Use the desktop app's `automation_update` tool to create a heartbeat in the current chat, every five minutes. Do not create a standalone cron or OS cron as a substitute. Use a stable name containing repository and PR number. Inspect the chat context and `$CODEX_HOME/automations/*/automation.toml` (or `~/.codex/automations/`) for a matching automation by repository + PR; confirm a known ID with the tool. Reuse an active match. If paused, do not reactivate it silently: ask whether the user wants to resume it. If identity/status cannot be established, report the uncertainty before creating a potential duplicate. Save the returned automation ID in the chat and, when possible, in the automation prompt for later stop/update operations.

Set an initial expiry 24 hours after creation, stated as an absolute time with timezone in the prompt. Do not reset that deadline on every tick. The user can extend it. Monitoring completion and timeout must disable the automation through the tool, never by emitting a pretend directive.

If scheduling is unavailable, do not claim monitoring is running. Report the published PR and provide the manual fallback: «Проверь замечания Codex в PR <URL> и предложи исправления». This skill requires desktop scheduling for automatic follow-up; CLI/IDE support is not assumed.

Report the PR link, checks run, whether monitoring was actually created/reused, its cadence and expiry. After initial setup, keep unchanged polling quiet. Opening a PR does not guarantee the reviewer has started or finished.

## After the user accepts fixes

Recheck the local branch, HEAD and worktree against the monitored PR before editing. Apply only accepted findings, validate the change and show the result. Consent to edit alone does not authorize commit/push; explicit «исправь и отправь» does. After an authorized push, reuse the existing PR and monitor, record the new SHA, and let CI request another review. Retain rejected finding decisions and avoid re-proposing them unchanged.
