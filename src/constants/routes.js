/* routes constants */

export default {
  ROOT_URL: '/angel',
  RECIPE_URL: '/recipes/0',
  RULES_URL: '/rules',
  INGREDIENTS_URL: '/ingredients',

  baseUrl: () => process.env.NODE_ENV == 'production' ? '/angel' : '',
};
