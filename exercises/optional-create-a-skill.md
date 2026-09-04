# Optional — Create a Prompt Engineer Skill with `/create-skill`

> Not part of the session. Take-home material.

## Goal
Practice using `/create-skill` in a new chat to build a prompt-engineering skill that turns any weak prompt into a better one.

## Your Task
Start a new chat and use `/create-skill` to create a skill called `prompt-refiner`.

Ask Copilot to become a prompt engineer that improves any prompt.

The skill should help Copilot do three things:
1. Rewrite a vague prompt into a clearer prompt.
2. Add missing context, constraints, and output format.
3. Keep the original intent while making the prompt more useful.

## Requirements
Your skill should include:
- A short, clear `description`
- A `when to use` section
- A simple step-by-step workflow for improving any prompt
- At least one before-and-after example
- Instructions for improving any prompt, not just one specific topic

## Success Criteria
The exercise is complete when:
- The skill file is created
- The skill clearly explains how to improve prompts
- The output is specific enough that Copilot can turn any rough prompt into a better one

## Bonus Challenge
Use this rough prompt in the new chat:

```text
write something about my app
```

Show how your skill would turn it into a stronger prompt by adding:
- the app purpose
- the target audience
- the output format
- the tone

## Example Result
Your improved prompt could look like this:

```text
Write a short product description for my app.
The app helps students plan study sessions.
Write for a general audience in a friendly tone.
Return the result as a 3-sentence paragraph and include one headline.
```
