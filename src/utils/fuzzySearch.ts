/**
 * Fuzzy search utility that finds matches even with typos and partial matches
 * @param query - The search query
 * @param text - The text to search in
 * @returns true if there's a fuzzy match, false otherwise
 */
export function fuzzySearch(query: string, text: string): boolean {
  if (!query || !text) return false;

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // Fuzzy match - check if characters appear in order
  let queryIndex = 0;
  let textIndex = 0;

  while (queryIndex < queryLower.length && textIndex < textLower.length) {
    if (queryLower[queryIndex] === textLower[textIndex]) {
      queryIndex++;
    }
    textIndex++;
  }

  return queryIndex === queryLower.length;
}

/**
 * Fuzzy search with scoring - returns items with match scores
 * @param query - The search query
 * @param items - Array of items to search
 * @param getSearchText - Function to extract searchable text from each item
 * @returns Array of items with their match scores, sorted by relevance
 */
export function fuzzySearchWithScore<T>(
  query: string,
  items: T[],
  getSearchText: (item: T) => string
): Array<{ item: T; score: number }> {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 1 }));
  }

  const results: Array<{ item: T; score: number }> = [];

  for (const item of items) {
    const searchText = getSearchText(item);
    const score = calculateFuzzyScore(query, searchText);

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Calculate a fuzzy match score between query and text
 * @param query - The search query
 * @param text - The text to match against
 * @returns Score between 0 and 1, where 1 is perfect match
 */
function calculateFuzzyScore(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact substring match gets highest score
  if (textLower.includes(queryLower)) {
    return 1.0;
  }

  // Check for word boundary matches
  const words = textLower.split(/\s+/);
  let wordMatchScore = 0;

  for (const word of words) {
    if (word.startsWith(queryLower)) {
      wordMatchScore = Math.max(wordMatchScore, 0.8);
    } else if (word.includes(queryLower)) {
      wordMatchScore = Math.max(wordMatchScore, 0.6);
    }
  }

  if (wordMatchScore > 0) {
    return wordMatchScore;
  }

  // Fuzzy character matching
  let queryIndex = 0;
  let textIndex = 0;
  let consecutiveMatches = 0;
  let totalMatches = 0;

  while (queryIndex < queryLower.length && textIndex < textLower.length) {
    if (queryLower[queryIndex] === textLower[textIndex]) {
      consecutiveMatches++;
      totalMatches++;
      queryIndex++;
    } else {
      consecutiveMatches = 0;
    }
    textIndex++;
  }

  if (queryIndex === queryLower.length) {
    // All query characters found
    const completeness = totalMatches / queryLower.length;
    const consecutiveness = consecutiveMatches / queryLower.length;
    return Math.min(0.5 + completeness * 0.3 + consecutiveness * 0.2, 0.9);
  }

  return 0;
}
