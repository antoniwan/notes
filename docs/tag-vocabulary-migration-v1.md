# Tag Vocabulary Migration v1

This report captures the initial normalization pass strategy for high-usage tags and common aliases.

## Scope

- Canonical language: English
- Vocabulary model: core + optional domain extensions
- Rollout: top-usage normalization first, then long-tail cleanup

## Priority Alias Mappings

| Existing Tag | Canonical Tag |
| --- | --- |
| `consciencia` | `consciousness` |
| `sanación` / `sanacion` | `healing` |
| `salud-mental` | `mental-health` |
| `autenticidad` | `authenticity` |
| `auto-reflexión` / `auto-reflexion` | `self-reflection` |
| `transformación` / `transformacion` | `transformation` |
| `regulación-emocional` / `regulacion-emocional` | `emotional-regulation` |
| `terapia` | `therapy` |
| `justicia-social` | `social-justice` |
| `crítica-sistémica` / `critica-sistemica` | `systemic-critique` |
| `valores` | `values` |
| `verdad` | `truth` |
| `propósito` / `proposito` | `purpose` |
| `política` / `politica` | `politics` |
| `escritura` | `writing` |
| `sociedad` | `social-issues` |
| `empatía` / `empatia` | `empathy` |
| `compasión` / `compasion` | `compassion` |

## Consolidation Targets

These should be reviewed for convergence where semantics overlap:

- `social-issues`, `social-critique`, `social-justice`
- `systems-strategy`, `systems`, `systemic-critique`
- `personal-growth`, `self-improvement`, `transformation`
- `health`, `wellness`, `self-care`, `mental-health`

## Notes

- Keep niche tags if reused in 3+ posts; otherwise treat as candidates for aliasing or retirement.
- Content-form tags in the `/tag` prelude are still controlled by `src/utils/tag/contentFormTags.ts`.
