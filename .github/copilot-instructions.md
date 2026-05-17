# Copilot instructions for Compliance Framework Compare

Compliance Framework Compare is a focused cybersecurity portfolio project owned by Matthew Faber. The goal is straightforward: A static comparison tool that helps learners see where major compliance and security frameworks overlap, differ, and serve different purposes without pretending they are interchangeable checklists. Deployment target is GitHub Pages. The stack is HTML5, CSS3, Vanilla JavaScript, GitHub Pages. Keep the repo easy to review, easy to explain in an interview, and easy to deploy from a clean branch.

When helping here, bias toward the smallest useful implementation. Preserve the deliberate no-build-step approach for the frontend. If the project uses Azure Functions, keep Node tooling isolated to `api/` and do not introduce root-level package management. Prefer plain HTML, CSS, and vanilla JavaScript that a recruiter can understand quickly by opening the repo.

What Copilot should help with:
- Keep framework comparisons structured, concise, and careful about scope differences.
- Design tables or cards that help users compare intent, not just memorize labels.
- Preserve a static, reviewable implementation that reads cleanly to recruiters.

Domain guardrail: The key value here is careful comparison. This project should clarify what each framework is for, who uses it, and where analogies break down. Treat copy, labels, and examples as reviewable cybersecurity content, not filler text.

What to avoid:
- Do not treat NIST, ISO, SOC 2, and CIS as if they are interchangeable certifications.
- Do not oversimplify framework nuance into misleading one-line equivalencies.
- Do not add a build pipeline to a static comparison project.

Keep README examples, testing steps, and placeholder UI text aligned whenever scope changes. This project has no secret-bearing runtime configuration in-repo. If you add data files later, keep them human-readable and stable so Matthew or another reviewer can audit the content without reverse engineering generated output.
