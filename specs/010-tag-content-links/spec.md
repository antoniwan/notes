# Feature Specification: Tag Content Links Prelude

**Feature Branch**: `010-tag-content-links`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "On the tag page, add a simple feature before the tag cloud that shows sentence-style links such as I have written [poems], [essays], [songs], [ideas], and [manifestos], where each bracketed term links to the corresponding tag. Use only content-form tags and treat this as an additional browsing path."

## Clarifications

### Session 2026-04-10

- Q: How should content-form tags be sourced and ordered in the prelude? → A: Infer all content-form tags dynamically from site tags and sort by post count descending.
- Q: How should ties be handled when tags have equal content counts? → A: Sort tied tags alphabetically.
- Q: What rule defines whether a tag is content-form? → A: A tag is content-form only if its normalized label matches a canonical writing-form vocabulary.
- Q: Which label form should be shown in the prelude after normalization? → A: Always display canonical plural labels.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse by content form quickly (Priority: P1)

As a reader on the tags page, I can use a short sentence with linked content forms (for example poems, essays, songs, ideas, manifestos) to jump directly into the kind of writing I want.

**Why this priority**: This is the core value of the feature: faster discovery by writing form without scanning the full cloud.

**Independent Test**: Open the tags page and use the sentence links only. If each visible content-form term takes the reader to the matching tag listing, the story is complete.

**Acceptance Scenarios**:

1. **Given** the tags page contains at least one supported content-form tag, **When** the page loads, **Then** a sentence-style link block appears above the tag cloud.
2. **Given** a content-form link is visible in that sentence block, **When** the reader selects it, **Then** they are taken to the corresponding tag destination.

---

### User Story 2 - Keep browsing language natural and readable (Priority: P2)

As a reader, I see the prelude as natural language rather than a raw list, so browsing feels editorial and intentional.

**Why this priority**: The feature should improve clarity and tone, not add visual noise.

**Independent Test**: Review the tags page and confirm the prelude reads as a coherent sentence with separators and punctuation, while each linked term is still obvious and clickable.

**Acceptance Scenarios**:

1. **Given** multiple content-form tags are available, **When** they are shown in the prelude, **Then** they are ordered by highest content volume first and presented in a grammatically readable sequence with proper punctuation.

---

### User Story 3 - Handle missing content-form tags safely (Priority: P3)

As a reader, I should not see broken or irrelevant links when expected content-form tags are absent.

**Why this priority**: Prevents dead ends and preserves trust in navigation.

**Independent Test**: Remove or hide one expected content-form tag from available site tags and verify the prelude omits it without layout or wording breakage.

**Acceptance Scenarios**:

1. **Given** one or more predefined content-form tags are not available, **When** the tags page renders, **Then** only available content-form tags are linked and shown.

---

### Edge Cases

- No predefined content-form tags are available on the site: the prelude is hidden and the tag cloud remains the first browsing element.
- Only one content-form tag is available: sentence grammar remains valid and does not show dangling commas or conjunctions.
- A content-form label differs from the tag slug formatting: displayed text remains human-readable while navigation still resolves to the correct tag destination.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The tags page MUST include a sentence-style prelude block positioned before the existing tag cloud.
- **FR-002**: The prelude MUST include only tags classified as content-form tags and MUST exclude all other tag types.
- **FR-003**: A tag MUST be classified as content-form only when its normalized label matches the canonical writing-form vocabulary (including singular/plural variants that map to the same canonical form).
- **FR-004**: Each content-form term shown in the prelude MUST be an interactive link to that term's corresponding tag browsing destination.
- **FR-005**: The prelude MUST dynamically identify content-form tags from the site's known tag set and show only those currently available.
- **FR-006**: The prelude MUST order displayed content-form tags by descending associated content count.
- **FR-007**: When two or more displayed content-form tags have equal associated content counts, the system MUST order those tied tags alphabetically.
- **FR-008**: The prelude wording MUST remain readable and grammatically valid regardless of whether 1, many, or none of the eligible content-form tags are available.
- **FR-009**: If no eligible content-form tags are available, the system MUST hide the prelude without affecting tag cloud visibility.
- **FR-010**: The feature MUST preserve the existing tag cloud browsing behavior as a secondary path on the same page.
- **FR-011**: The tag taxonomy used by this feature MUST enforce consistent canonical tag forms so duplicate singular/plural variants are normalized rather than treated as separate content-form tags.
- **FR-012**: Prelude link text MUST display canonical plural writing-form labels for all normalized content-form tags.

### Key Entities _(include if feature involves data)_

- **Content-Form Tag**: A tag representing writing format whose normalized label matches a canonical writing-form vocabulary and is eligible for inclusion in the prelude.
- **Tag Prelude Entry**: A display unit containing a readable label and link target for one eligible content-form tag.
- **Tag Catalog**: The complete set of tags known to the site, used to identify available content-form tags and rank them by associated content volume.
- **Canonical Writing-Form Vocabulary**: A standardized set of accepted writing-form labels and their normalized variants (for example singular/plural forms) used for classification consistency.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of displayed prelude links navigate to the intended tag browsing destination during acceptance testing.
- **SC-002**: Readers can identify and select a desired content-form link from the prelude in under 5 seconds in moderated usability checks.
- **SC-003**: In a content audit of the current site, prelude ordering matches descending content count for 100% of displayed content-form tags.
- **SC-004**: For any equal-count tags in acceptance testing, displayed order follows alphabetical tie-breaking in 100% of cases.
- **SC-005**: When at least one eligible content-form tag exists, the prelude is visible on 100% of tags page loads; when none exist, it is hidden on 100% of loads.
- **SC-006**: In taxonomy validation, no singular/plural variant pair is treated as separate content-form categories in the prelude output.
- **SC-007**: In acceptance testing, 100% of displayed prelude labels use canonical plural forms for normalized content-form categories.

## Assumptions

- Content-form tags can be inferred from the site's existing tag taxonomy with sufficient reliability for ranking and display.
- A maintained canonical writing-form vocabulary is available to normalize singular/plural variations consistently.
- The existing tag destinations and tag cloud behavior are already correct and do not require redesign in this feature.
- This feature applies to the main tags browsing page only and does not introduce new pages or filters.
- Readers access this feature in the same languages and navigation contexts currently supported by the tags page.
