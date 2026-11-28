/**
 * Filters a collection of products by partial case-insensitive match on name or category.
 * Returns a shallow copy of the input array when the search query is empty or whitespace.
 *
 * @param {Array<Object>} items The list of product objects to search through.
 * @param {string} [query=""] The search term to match against product name or category.
 * @returns {Array<Object>} A new array containing the matching product objects.
 */
export const searchProducts = (items, query = "") => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return [...items];

    return items.filter((product) => {
        const name = (product.name ?? "").toLowerCase();
        const category = (product.category ?? "").toLowerCase();

        return name.includes(cleanQuery) || category.includes(cleanQuery);
    });
};

/**
 * Filters a collection of products within an inclusive price range.
 * Returns an empty array when the minimum price exceeds the maximum price.
 *
 * @param {Array<Object>} items The list of product objects to filter.
 * @param {number} [minPrice=0] The minimum inclusive price threshold.
 * @param {number} [maxPrice=Infinity] The maximum inclusive price threshold.
 * @returns {Array<Object>} A new array of products whose price falls within the specified range.
 */
export const filterByPriceRange = (items, minPrice = 0, maxPrice = Infinity) => {
    if (minPrice > maxPrice) return [];

    return items.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
    );
};

/**
 * Returns a new array of products sorted by the specified criterion without mutating the original array.
 * Returns a shallow copy in the original order when the sort criterion is unrecognized.
 *
 * @param {Array<Object>} items The list of product objects to sort.
 * @param {string} [sortBy="price-asc"] The sort criterion ("price-asc", "price-desc", "name-asc", or "stock-desc").
 * @returns {Array<Object>} A new sorted array of product objects, or a shallow copy in original order.
 */
export const sortProductsImmutable = (items, sortBy = "price-asc") => {
    const copy = [...items];

    const comparators = {
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        "name-asc": (a, b) => (a.name ?? "").localeCompare(b.name ?? "", "es"),
        "stock-desc": (a, b) => b.stock - a.stock,
    };

    const comparator = Object.hasOwn(comparators, sortBy)
        ? comparators[sortBy]
        : null;

    if (!comparator) return copy;

    return copy.sort(comparator);
};

/**
 * Queries a product catalog by composing stock filtering, text search, price range filtering,
 * and immutable sorting into a single configurable pipeline.
 *
 * @param {Array<Object>} items The list of product objects to query.
 * @param {Object} [options={}] The query configuration options.
 * @param {string} [options.query=""] The search term to match against name or category.
 * @param {number} [options.minPrice=0] The minimum inclusive price threshold.
 * @param {number} [options.maxPrice=Infinity] The maximum inclusive price threshold.
 * @param {boolean} [options.onlyInStock=false] Whether to include only products with stock greater than zero.
 * @param {string} [options.sortBy="price-asc"] The sort criterion to apply to the matching results.
 * @returns {{totalMatches: number, appliedSort: string, items: Array<Object>}} A structured response with match count, applied sort criterion, and resulting items.
 */
export const queryCatalog = (items, options = {}) => {
    const {
        query = "",
        minPrice = 0,
        maxPrice = Infinity,
        onlyInStock = false,
        sortBy = "price-asc",
    } = options;

    const stockFiltered = onlyInStock
        ? items.filter((product) => product.stock > 0)
        : items;
    const searched = searchProducts(stockFiltered, query);
    const priceFiltered = filterByPriceRange(searched, minPrice, maxPrice);
    const sortedItems = sortProductsImmutable(priceFiltered, sortBy);

    return {
        totalMatches: sortedItems.length,
        appliedSort: sortBy,
        items: sortedItems,
    };
};
