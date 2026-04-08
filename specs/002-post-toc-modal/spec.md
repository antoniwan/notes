# Feature Specification: Floating Post Table of Contents

**Feature Branch**: `002-post-toc-modal`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "I want to add a table of contents component that is a floating modal (you can close it if you don't like it) for posts, because some of these, like the 62 minute piece are hard to navigate, this will require headings I will have to add to the longer pieces, for now, use the last post (on leader and leadership-adjacent things) to test this work make it beautiful!"

<!--
  Notes platform: Features touching `src/content/p/`, frontmatter, feeds, or Schema.org output
  MUST align with docs/frontmatter-spec.md and related docs in docs/. See
  `.specify/memory/constitution.md` for non-negotiable constraints (static-first default, privacy,
  verification gates).
-->

## Clarifications

### Session 2026-04-08

- Q: What should mobile-first TOC behavior be? → A: Show a compact "Contents" trigger on mobile; open as modal only on tap; auto-close after selecting a section.
- Q: How should legibility be validated for the TOC design? → A: Prioritize visual style first; legibility checked subjectively during review.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Jump to Any Section Quickly (Priority: P1)

As a reader of a long post, I can open a floating table of contents and jump directly to a section so I do not need to scroll through the entire article to find what I need.

**Why this priority**: This directly addresses the core pain point (hard navigation in long reads) and delivers immediate value for time-constrained readers.

**Independent Test**: Open a long post with multiple headings, open the table of contents, select any heading, and verify the page moves to the matching section.

**Acceptance Scenarios**:

1. **Given** a post with multiple section headings, **When** a reader opens the table of contents, **Then** they see a list of available sections in reading order.
2. **Given** the table of contents is open, **When** a reader selects a section item on mobile, **Then** the page moves to that section and the table of contents closes automatically.

---

### User Story 2 - Dismiss the Navigation Overlay (Priority: P2)

As a reader who prefers distraction-free reading, I can close the floating table of contents so it does not stay on screen when I do not want it.

**Why this priority**: The feature should remain optional and non-intrusive; forced overlays would harm usability for readers who do not need navigation help.

**Independent Test**: Open the table of contents, close it, and verify the article remains fully readable with no blocked content.

**Acceptance Scenarios**:

1. **Given** the table of contents is visible, **When** the reader closes it, **Then** the overlay disappears and reading can continue normally.
2. **Given** a reader has closed the table of contents on a post, **When** they continue scrolling and reading, **Then** no persistent obstruction covers article content.

---

### User Story 3 - Enjoy a Polished Reading Experience (Priority: P3)

As a reader, I experience the table of contents as visually polished and aligned with the site style, so navigation support feels intentional rather than distracting.

**Why this priority**: The request explicitly calls for a beautiful result; visual quality affects perceived trust and overall reading comfort.

**Independent Test**: Review the component in the latest leadership-focused post and verify that styling is legible, coherent, and visually balanced against surrounding content.

**Acceptance Scenarios**:

1. **Given** a reader opens the table of contents, **When** it is displayed, **Then** text is readable, spacing is clear, and visual hierarchy makes section scanning easy.
2. **Given** the page theme and article layout, **When** the table of contents appears, **Then** it looks consistent with the rest of the site design.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Post has no eligible headings to build a table of contents.
- Post has only one heading beyond the title.
- Multiple headings share very similar names.
- Very long heading labels risk truncation or wrapping in the modal.
- Reader lands on a deep-linked section before opening the table of contents.
- On small screens, the modal could obscure too much content if opened accidentally.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST provide a floating table of contents entry point on post pages that include navigable section headings.
- **FR-002**: The system MUST display table of contents items in the same order sections appear in the post.
- **FR-003**: Users MUST be able to open and close the table of contents at any time while reading.
- **FR-004**: Selecting a table of contents item MUST move the reader to the matching section in the same post.
- **FR-004a**: On mobile-sized viewports, the system MUST show a compact "Contents" trigger instead of a persistent expanded panel.
- **FR-004b**: On mobile-sized viewports, the table of contents MUST open only after explicit user tap and MUST close automatically after a section is selected.
- **FR-005**: The table of contents MUST not block core reading content when closed.
- **FR-006**: The table of contents MUST gracefully handle posts with insufficient headings by hiding or disabling itself rather than showing empty content.
- **FR-007**: The latest post about leadership and leadership-adjacent themes MUST be usable as an initial validation case for this feature.
- **FR-008**: Long-form posts identified as difficult to navigate (including the existing 62-minute read) MUST be supported by heading-based navigation once headings are present.
- **FR-009**: The visual presentation of the table of contents MUST be intentionally styled to appear polished and consistent with the site aesthetic.
- **FR-010**: Legibility MUST be reviewed as part of visual design acceptance using stakeholder qualitative review rather than fixed numeric thresholds for this phase.

### Key Entities _(include if feature involves data)_

- **Post Navigation Section**: A navigable section within a post, represented by heading text and a corresponding in-page destination.
- **Table of Contents Item**: A navigation entry shown in the floating modal that maps one-to-one to a post navigation section.
- **Table of Contents Display State**: The reader-visible state (open or closed) controlling whether the floating modal is currently shown.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: In usability checks on long-form posts, readers can reach a chosen section via the table of contents in 10 seconds or less.
- **SC-002**: 100% of table of contents selections in test posts land readers on the intended section without manual scrolling correction.
- **SC-003**: In acceptance review of the initial leadership post test case, all defined scenarios for open, close, and section jump behavior pass.
- **SC-004**: In qualitative review, the table of contents is judged as visually cohesive and readable by stakeholders with no blocking visual issues reported.
- **SC-005**: In mobile acceptance checks, 100% of section selections from the modal return the reader to full article view immediately after navigation.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- The feature applies to post-reading pages and does not change non-post page types.
- Long-form posts may need added or improved section headings to fully benefit from table-of-contents navigation.
- The latest leadership-focused post is available and will be used as the first acceptance test artifact.
- The initial rollout prioritizes smooth desktop and mobile reading behavior through an explicit tap-to-open, auto-close interaction on mobile.
