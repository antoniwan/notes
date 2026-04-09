# Feature Specification: Post Sidebar Usability Redesign

**Feature Branch**: `005-redesign-post-sidebar`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "I want you to audit the post sidebar and propose a new layout for the post sidebar for improved usability and features. it needs to be best-in-class considering the type of publication we are, focused on legibility and maintaing the cool features we have already built, but enhancing them. one example: we have multiple categories for each post but we are only showcasing one of them."

<!--
  Notes platform: Features touching `src/content/p/`, frontmatter, feeds, or Schema.org output
  MUST align with docs/frontmatter-spec.md and related docs in docs/. See
  `.specify/memory/constitution.md` for non-negotiable constraints (static-first default, privacy,
  verification gates).
-->

## Clarifications

### Session 2026-04-09

- Q: Which rule should determine the primary category for breadcrumb/single-slot surfaces? → A: Use the first category in frontmatter order.
- Q: Where should social sharing live in the redesigned sidebar hierarchy? → A: Place it in a lower Actions section after taxonomy/metadata.
- Q: How should category overflow be handled when posts have many categories? → A: Show first 3 categories with a “Show all” control for the full set.
- Q: On mobile, should sidebar metadata be expanded or collapsed by default? → A: Keep metadata collapsed by default with clear section headers and tap-to-expand blocks.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Scan Context Instantly (Priority: P1)

As a reader landing on a post, I can immediately understand what this piece is about and how it is classified, so I can decide quickly whether to read now, save it, or explore adjacent topics.

**Why this priority**: Fast comprehension and legible context are the highest-value outcomes for long-form publication reading.

**Independent Test**: Open any post page and verify the sidebar shows title context, publication metadata, all assigned categories, and key actions in a predictable order without requiring scrolling in most desktop cases.

**Acceptance Scenarios**:

1. **Given** a post with one or more categories, **When** the sidebar is visible, **Then** every assigned category is displayed as an individual, readable, linked item.
2. **Given** a reader viewing the sidebar, **When** they scan top-to-bottom, **Then** information appears in a clear hierarchy from primary context (title/description) to secondary context (metadata/tags/actions).

---

### User Story 2 - Use Existing Sidebar Features Better (Priority: P2)

As a returning reader, I can access current sidebar capabilities (reading-time/read-state, sharing, taxonomy links) with less friction, so useful features feel integrated rather than scattered.

**Why this priority**: The request emphasizes preserving and enhancing existing features rather than replacing them.

**Independent Test**: Confirm that current sidebar feature set remains available, with improved grouping and readability that reduces duplicated or competing visual elements.

**Acceptance Scenarios**:

1. **Given** a post currently marked as read, **When** the sidebar loads, **Then** read-state feedback remains visible and understandable within the metadata area.
2. **Given** social sharing controls and taxonomy links are present, **When** a reader uses the sidebar, **Then** all controls remain accessible without obscuring primary reading context.

---

### User Story 3 - Read Comfortably Across Viewports (Priority: P3)

As a reader on desktop, tablet, or mobile, I experience consistent sidebar information architecture adapted to screen constraints, so supporting information remains useful without harming reading flow.

**Why this priority**: Responsive behavior is necessary for a best-in-class reading experience and prevents regressions on smaller screens.

**Independent Test**: Compare representative post pages at mobile, tablet, and desktop; verify the same information model is preserved while layout adapts for legibility and space constraints.

**Acceptance Scenarios**:

1. **Given** a desktop viewport, **When** the sidebar is rendered, **Then** key context is visible as a sticky side panel without overlap or clipping.
2. **Given** a mobile viewport, **When** metadata appears in the post flow, **Then** section grouping and order remain coherent and easy to scan.

---

### Edge Cases

- Posts with no categories, no tags, or missing optional metadata must avoid empty section shells.
- Posts with more than three categories must remain readable without line-wrapping chaos or overflow.
- Very long category/tag names must wrap cleanly and stay tappable/clickable.
- Posts with updated date equal to publication date must not duplicate date messaging.
- Very long titles and descriptions must keep sidebar rhythm and avoid pushing all supporting context below the fold.
- Translation-enabled posts must not lose language toggle discoverability due to sidebar reordering.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The post sidebar MUST follow a defined information hierarchy that prioritizes title context, then post metadata, then navigation/discovery actions.
- **FR-002**: The system MUST display all categories assigned to a post in the sidebar, each as an individual linked item.
- **FR-002a**: When a post has more than three categories, the sidebar MUST show the first three categories by default and provide a “Show all” control that reveals the full linked category set.
- **FR-003**: The system MUST preserve existing taxonomy navigation behavior for categories and tags.
- **FR-004**: The sidebar MUST preserve existing read-time/read-state behavior and visual status feedback.
- **FR-005**: The sidebar MUST preserve existing social sharing capability and place it in a lower Actions section after taxonomy/metadata so it does not compete with primary reading context.
- **FR-006**: The desktop sidebar MUST remain sticky and legible without obscuring main content or causing layout collision.
- **FR-007**: The mobile metadata block MUST use the same grouping model as desktop (adapted for vertical flow), preserving feature parity.
- **FR-007a**: On mobile, metadata sections MUST be collapsed by default, include clear section headers, and support tap-to-expand access to details.
- **FR-008**: The sidebar redesign MUST maintain current publication metadata support (published date, optional updated date, reading time, tags, author where shown).
- **FR-009**: The redesign MUST avoid introducing additional reader steps to access currently available sidebar actions.
- **FR-010**: The redesign MUST improve visual legibility through clearer spacing, heading hierarchy, and scannable grouping.
- **FR-011**: The redesign MUST retain compatibility with existing post content and metadata structure, including posts with multiple categories.
- **FR-012**: Breadcrumb category treatment MUST remain consistent with the multi-category model by using the first category in frontmatter order as the primary category and preserving access to remaining categories elsewhere in the sidebar.

## Audit Findings

- The current sidebar presents rich metadata but mixes priority levels, which weakens first-glance comprehension.
- Multi-category posts currently expose only one category in key sidebar/breadcrumb surfaces, reducing taxonomy discoverability.
- Existing strong features (read-state feedback, sharing, tags, sticky behavior) exist but compete visually instead of operating as cohesive groups.
- Desktop and mobile present similar information but with duplicated structure that can drift and reduce consistency over time.

## Proposed Sidebar Layout

1. **Post Context Block (highest priority)**  
   Post title, short description, and publication freshness summary.
2. **Reading Signals Block**  
   Reading time/read status presented as a compact, high-legibility status row.
3. **Taxonomy Block**  
   Full category set first (all linked categories), then tags as a secondary cluster.
4. **Action Block**  
   Social sharing controls in a distinct, low-noise area after context and taxonomy.
5. **Secondary Metadata Block**  
   Author and other supporting details placed last to preserve scan order.

This layout keeps all existing capabilities while improving hierarchy, reducing cognitive load, and making multi-category classification explicit.

### Key Entities _(include if feature involves data)_

- **Sidebar Section**: A grouped content block in the sidebar (for example, post context, metadata, taxonomy, actions) with a clear heading and internal item order.
- **Post Taxonomy Set**: The complete set of category and tag labels assigned to a post and rendered as linked discovery items.
- **Primary Category**: The first category in frontmatter order, used where a single category is required by a constrained UI element (for example, breadcrumb), while not suppressing other assigned categories in the full taxonomy set.
- **Reading Status Signal**: Reader-facing status feedback that represents unread vs. previously read state in the reading-time area.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In sidebar usability review sessions, at least 90% of participants can correctly identify post context (topic classification and freshness) within 8 seconds of landing on a post.
- **SC-002**: 100% of audited multi-category posts display all assigned categories in the sidebar without losing link functionality.
- **SC-003**: In representative desktop and mobile checks, 100% of required sidebar feature groups (context, metadata, taxonomy, actions) are present with no missing existing capability.
- **SC-004**: In qualitative design review, stakeholders rate the new sidebar as more legible and polished than the previous version in at least 80% of comparisons.
- **SC-005**: No critical regressions are observed in reading flow, taxonomy navigation, or read-status visibility across representative posts and breakpoints.

## Assumptions

- Primary audience is long-form readers who value intellectual context, taxonomy clarity, and calm visual presentation.
- Scope is limited to post-page sidebar and equivalent mobile metadata presentation, not a full-site information architecture rewrite.
- Existing sidebar capabilities (sharing, reading status, metadata, taxonomy links) remain in scope to preserve and enhance, not remove.
- Category arrays in post metadata are the source of truth and may contain multiple category IDs.
- The redesign is expected to align with the current UI refinement direction while focusing specifically on post sidebar usability.
