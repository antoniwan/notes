# Feature Specification: Tag Intro Links

**Feature Branch**: `009-tag-content-links`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "in the tag page, I believe we can add a simple feature before the tag cloud where we can say "I've written [poems], [essays], [songs], [ideas]. I've written [manifestos]" but the sentences and [] are links depending on tags, if we understand ALL the tags in the site, I'm pretty sure we can come up with an interesting list here for content form tags and tags only. Which I think is just another way to browse the site."

<!--
  Notes platform: Features touching `src/content/p/`, frontmatter, feeds, or Schema.org output
  MUST align with docs/frontmatter-spec.md and related docs in docs/. See
  `.specify/memory/constitution.md` for non-negotiable constraints (static-first default, privacy,
  verification gates).
-->

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse by writing form (Priority: P1)

As a reader on the tag page, I can use a short introductory sentence with linked writing forms (such as poems, essays, songs, ideas, manifestos) to jump directly into that type of content.

**Why this priority**: This is the core value of the feature: giving readers a faster, more intentional path to discover content by form before scanning the broader tag cloud.

**Independent Test**: Open the tag page and confirm the introductory text appears above the tag cloud with clickable writing-form links that navigate to their corresponding tag pages.

**Acceptance Scenarios**:

1. **Given** the tag page includes at least one writing-form tag, **When** a reader views the page, **Then** they see an introductory sentence above the tag cloud containing links for available writing-form tags.
2. **Given** the introductory sentence is visible, **When** a reader clicks one of its linked forms, **Then** they are taken to the corresponding tag results page for that form.

---

### User Story 2 - Trust only valid tag links (Priority: P2)

As a reader, I only see links for writing-form terms that actually exist as tags in the site, so every link works and reflects real content.

**Why this priority**: Broken or irrelevant links reduce trust and create dead-end navigation, so this behavior protects user experience.

**Independent Test**: Compare the introductory links against the site's known tags and verify each displayed link maps to an existing tag with accessible results.

**Acceptance Scenarios**:

1. **Given** a candidate writing-form term does not exist in the site's tags, **When** the tag page is rendered, **Then** that term is not shown as a link in the introductory sentence.
2. **Given** a candidate writing-form term exists in the site's tags, **When** the tag page is rendered, **Then** that term is shown as a link in the introductory sentence.

---

### User Story 3 - Keep discovery text readable (Priority: P3)

As a reader, I can understand the introductory sentence quickly because it reads naturally even when some writing-form links are unavailable.

**Why this priority**: The feature should enhance discovery without clutter or awkward phrasing.

**Independent Test**: Validate the sentence formatting for cases where all, some, or only one writing-form tag is available and confirm it remains grammatical and easy to scan.

**Acceptance Scenarios**:

1. **Given** only a subset of target writing-form tags exists, **When** the introductory text is shown, **Then** the sentence remains grammatically correct and uses only available links.
2. **Given** no target writing-form tags exist, **When** the tag page is shown, **Then** the introductory sentence is omitted and the tag cloud remains the first browsing element.

### Edge Cases

- A target writing-form tag exists but currently has zero published items; the link should either be omitted or lead to a valid empty-state page without errors.
- Tag names may vary in capitalization or punctuation; matching must still identify the intended writing-form tags consistently.
- If only one writing-form tag is available, the intro still renders as a complete sentence without list separators.
- If the tag list is temporarily unavailable during page generation, the page still loads and the tag cloud remains usable.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The tag page MUST display a short introductory discovery sentence above the tag cloud when at least one qualifying writing-form tag is available.
- **FR-002**: The introductory sentence MUST include only writing-form terms that correspond to existing site tags.
- **FR-003**: Each displayed writing-form term in the introductory sentence MUST be presented as a clickable link to that tag's browsing page.
- **FR-004**: The introductory sentence MUST adapt its punctuation and conjunctions so the text remains grammatically correct for 1, 2, or many available links.
- **FR-005**: The system MUST omit the introductory sentence entirely when none of the target writing-form tags are available.
- **FR-006**: The feature MUST not change the existing tag cloud behavior or ordering.
- **FR-007**: The list of target writing-form terms MUST be limited to content-form tags and exclude topic-oriented tags.

### Key Entities _(include if feature involves data)_

- **Writing Form Tag**: A site tag that represents a content format (for example poem, essay, song, idea, manifesto) and is eligible to appear in the introductory sentence.
- **Tag Intro Link Set**: The ordered subset of writing-form tags that exist on the site and are displayed as links in the introductory sentence.
- **Tag Browse Destination**: The destination view that lists content associated with a selected tag.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of links shown in the introductory sentence resolve to valid tag browsing pages.
- **SC-002**: In usability checks, at least 80% of readers can identify a writing-form path to explore within 10 seconds of opening the tag page.
- **SC-003**: In content QA, 100% of published tag-page builds show only existing writing-form tags in the introductory sentence.
- **SC-004**: Within the first evaluation period after release, visits entering content through writing-form links account for at least 10% of tag-page outbound navigation events.

## Assumptions

- The tag page already has a stable way to enumerate all existing site tags before rendering the tag cloud.
- Writing forms are represented as normal tags and are not stored in a separate taxonomy.
- The initial writing-form vocabulary includes poems, essays, songs, ideas, and manifestos, and can be revised later without changing the feature goal.
- This feature targets discovery behavior only and does not alter post content, publication workflows, or tag creation rules.
