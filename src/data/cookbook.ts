import recipes from './cookbookRecipes.json';

export const COOKBOOK_URL = 'https://cookbook.antoniwan.online';
export const cookbookRecipes = recipes;

export function buildCookbookRedirects(): Record<string, string> {
  const redirects: Record<string, string> = { '/recipes': COOKBOOK_URL + '/' };
  for (const recipe of cookbookRecipes) {
    for (const prefix of ['/p/recipes/', '/blog/recipes/']) {
      redirects[prefix + recipe.slug] = `${COOKBOOK_URL}/recipes/${recipe.slug}`;
      redirects[prefix + recipe.slug + '.md'] = `${COOKBOOK_URL}/recipes/${recipe.slug}.md`;
    }
  }
  for (const prefix of ['/p/', '/blog/']) {
    redirects[prefix + 'lemon-pepper-chicken'] = `${COOKBOOK_URL}/recipes/lemon-pepper-chicken`;
    redirects[prefix + 'lemon-pepper-chicken.md'] =
      `${COOKBOOK_URL}/recipes/lemon-pepper-chicken.md`;
  }
  return redirects;
}
