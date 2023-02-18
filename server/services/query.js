const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1; 

function getPagination({limit, page}) {
  page = Math.abs(page) || DEFAULT_PAGE_NUMBER; 
  limit = Math.abs(limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page-1) * limit;

  return {
    skip,
    limit
  };
}

module.exports = {
  getPagination
}