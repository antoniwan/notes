import { describe, expect, it } from 'vitest';
import { recipeFromMarkdown } from './recipeSections';

const body = `Intro paragraph.

## Ingredients

El pollo:

- 1½ lb **chicken** thighs
- [Sazón](/p/recipes/sazon), _homemade_

## Equipment

- Caldero

## Method

1. Season the chicken.
2. Brown it, about 3 minutes per side.

## Notes

- Leftovers: 4 days.
`;

describe('recipeFromMarkdown', () => {
  it('reads bullets under Ingredients and steps under Method, as plain text', () => {
    expect(recipeFromMarkdown(body)).toEqual({
      ingredients: ['1½ lb chicken thighs', 'Sazón, homemade'],
      instructions: ['Season the chicken.', 'Brown it, about 3 minutes per side.'],
    });
  });

  it('returns empty lists when the sections are missing', () => {
    expect(recipeFromMarkdown('Just text.')).toEqual({ ingredients: [], instructions: [] });
    expect(recipeFromMarkdown(undefined)).toEqual({ ingredients: [], instructions: [] });
  });
});
