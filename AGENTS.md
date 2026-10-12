# AGENTS.md — ToolLedger Working Rules

## 1. Never touch .env

- Never create, read, edit, delete, or print `.env`
  or other environment files containing real credentials.
- Only `.env.example` may be read or edited.
- Use placeholder values in `.env.example`.
- If configuration is needed, explain what the owner
  must add manually.
- Never include credentials in code, logs, or documentation.

## 2. Only use Devign components from my list

- Use only Devign (daisyUI) components from the owner's list.
- Never invent a component that is not on the list.
- Read the list before building or changing the interface.
- If a needed component is missing, stop and ask.
- Do not substitute a custom-built lookalike.
- Do not introduce another UI library.

## 3. Type errors must never block going online

- I do not want type errors to stop me putting this online:
  type errors must never block the build, deploy, or preview.
- Always check for type errors so I don't get blocked:
  run the typecheck after every relevant change, so errors
  surface early while they are still small.
- Use the project's existing build command.
- Keep TypeScript checking separate from the Vite build.
- If the project uses TypeScript project references and has
  no typecheck script, use `npx tsc -b`.
- Do not add or keep a TypeScript gate in the build command
  without approval.
- Fix build failures and type errors introduced by your changes.
- Report pre-existing errors clearly.
- Do not hide errors, weaken compiler settings, or disable
  checks merely to make verification pass.
- Do not describe the task as fully verified if checks failed
  or could not be run.

## 4. One thing at a time

- Complete one agreed task.
- Verify the relevant behaviour.
- Report what changed, what was checked, and any remaining issues.
- Stop for review before beginning the next task.
- Do not add unrelated features or perform broad refactoring.

## 5. Ask before installing anything new

- Get explicit approval before installing, removing,
  or upgrading dependencies.
- This applies to every package manager and to commands
  that download or initialise new tools.
- Explain why the dependency or tool is needed.
- Do not replace the existing technology setup.
