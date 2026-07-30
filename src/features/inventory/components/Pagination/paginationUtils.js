export function getPager(currentPage, totalPages) {
  // I need a non-duplicated and sorted array
  // With page 1, currentPage, totalPages and 2 pages before and after currentPage

  const pager = new Set([1, currentPage, totalPages]);
  // Loop between 2 page numbers before and after currentPage.
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    // Add page number to set if within range
    if (i > 1 && i < totalPages) pager.add(i);
  }

  // Sort ASC and return as array

  return [...pager].sort((a, b) => a - b);
}

// Adds/updates the page param in the URL search params
export function createPageLink(page, searchParams) {
  const params = new URLSearchParams(searchParams);
  params.set("page", page);
  return `?${params.toString()}`;
}
