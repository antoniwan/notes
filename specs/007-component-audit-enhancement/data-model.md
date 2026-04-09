# Data Model: Component Audit and Contextual Enhancements

## Entity: ComponentRecord

- **Purpose**: Canonical entry for each production-relevant component in audit scope.
- **Fields**:
  - `componentId` (string): Stable unique component identifier.
  - `componentPath` (string): Repository path for the component.
  - `componentType` (enum): `public-ui | layout | shared-internal`.
  - `usageContexts` (string[]): Known production flows where component behavior is exercised.
  - `scopeStatus` (enum): `in-scope | excluded`.
  - `exclusionReason` (string, optional): Required when `scopeStatus = excluded`.
- **Validation Rules**:
  - `componentId` must be unique across all records.
  - `scopeStatus = excluded` allowed only for test fixtures/prototypes.
  - `usageContexts` must contain at least one value when `scopeStatus = in-scope`.

## Entity: DocumentationProfile

- **Purpose**: Captures current-state understanding of a component before/after enhancement.
- **Fields**:
  - `componentId` (string): Link to `ComponentRecord`.
  - `purpose` (string): Why the component exists.
  - `expectedBehavior` (string[]): User-observable behaviors.
  - `supportedScenarios` (string[]): Baseline scenarios to verify.
  - `constraints` (string[]): Known boundaries and limitations.
  - `dependencies` (string[]): Upstream/downstream component or utility dependencies.
  - `lastReviewedOn` (date): Date of latest documentation review.
- **Validation Rules**:
  - One `DocumentationProfile` per in-scope `ComponentRecord`.
  - `supportedScenarios` must not be empty.

## Entity: EnhancementDecision

- **Purpose**: Describes whether and why a component receives an improvement.
- **Fields**:
  - `componentId` (string): Link to `ComponentRecord`.
  - `decision` (enum): `enhance | no-change`.
  - `contextAlignmentReason` (string): Justification tied to component responsibility.
  - `expectedUserValue` (string): Intended value from enhancement (required when `decision = enhance`).
  - `behaviorChangeRequested` (boolean): Whether behavior change is proposed.
  - `stakeholderApprovalRef` (string, optional): Required if `behaviorChangeRequested = true`.
- **Validation Rules**:
  - `decision = no-change` requires rationale.
  - `behaviorChangeRequested = true` requires non-empty `stakeholderApprovalRef`.

## Entity: VerificationResult

- **Purpose**: Tracks regression and acceptance outcomes per changed component.
- **Fields**:
  - `componentId` (string): Link to `ComponentRecord`.
  - `baselineScenarioResults` (map): Scenario -> pass/fail outcome.
  - `crossContextResults` (map): Context -> pass/fail outcome.
  - `enhancementCriteriaResult` (enum): `pass | fail`.
  - `openIssues` (string[]): Remaining failures/blockers.
  - `verifiedBy` (string): Reviewer/owner.
- **Validation Rules**:
  - All documented baseline scenarios must have recorded outcomes for changed components.
  - Any failed baseline or cross-context scenario blocks completion until resolved.

## Entity: AuditCompletionRegister

- **Purpose**: Stakeholder-facing summary of per-component completion state and evidence.
- **Fields**:
  - `componentId` (string): Link to `ComponentRecord`.
  - `accountedFor` (boolean)
  - `documented` (boolean)
  - `understood` (boolean)
  - `enhancedOrReviewed` (boolean)
  - `evidenceLinks` (string[]): Links to profile/decision/verification artifacts.
  - `finalStatus` (enum): `complete | blocked`.
- **Validation Rules**:
  - `finalStatus = complete` requires all four status booleans = true.
  - Every in-scope component must have one register entry.

## State Transitions

1. **Identified -> Documented**
   - Component is discovered and baseline documentation profile is completed.
2. **Documented -> Decisioned**
   - Enhancement decision captured with context-alignment rationale.
3. **Decisioned -> Verified**
   - If enhanced, all baseline and cross-context scenarios are verified; if no-change, review evidence is completed.
4. **Verified -> Complete**
   - Completion register marks accounted/documented/understood/enhanced-or-reviewed true with evidence attached.
