export const movie = {
  name: 'movie',
  title: 'Trending Movies',
  type: 'document',
  fields: [
    { name: 'title', title: 'Naslov', type: 'string' },
    { name: 'externalId', title: 'IMDb ID (npr. tt1234567)', type: 'string' },
    { name: 'poster', title: 'Poster Image', type: 'image', options: { hotspot: true } },
    { name: 'rating', title: 'Rating (npr. 6.5)', type: 'string' },
    { name: 'year', title: 'Year (npr. 2026)', type: 'string' },
    {
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}