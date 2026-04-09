# Enhancement triage rubric

Use this rubric before editing any in-scope file. **Default outcome: `no-change`** unless all gates pass.

## Eligibility gates

1. **Context alignment**: The change directly improves the component’s current responsibility (no unrelated features).
2. **User value**: A reader or maintainer benefit is stated in one sentence.
3. **Regression plan**: Baseline scenarios + cross-context checks are identified and can be run after the change.
4. **Behavior**: If user-visible behavior changes, **stakeholder approval** and an entry in `approved-behavior-changes.md` are required first.

## Outcomes

| Outcome     | When                                                     |
| ----------- | -------------------------------------------------------- |
| `enhance`   | All gates pass and approval exists if behavior changes.  |
| `no-change` | Any gate fails, or risk outweighs benefit for this pass. |

## This audit pass (007)

Baseline documentation and traceability were prioritized. **No code enhancements were approved** for batches A/B or shared helpers in the initial implementation cycle, to avoid unsolicited behavior drift.
