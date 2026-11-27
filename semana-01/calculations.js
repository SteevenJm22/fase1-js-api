/**
 * Rounds a numeric value to at most two decimal places using epsilon correction.
 *
 * @param {number} num The numeric value to round.
 * @returns {number} The number rounded to two decimal places.
 */
export const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

/**
 * Formats a numeric amount as a currency string with two fixed decimal places.
 * Places the negative sign before the currency symbol when the amount is negative.
 *
 * @param {number} [amount=0] The monetary amount to format.
 * @param {string} [symbol="$"] The currency symbol or prefix to display.
 * @returns {string} The formatted currency string.
 */
export const formatUSD = (amount = 0, symbol = "$") => {
    const isNegative = amount < 0;
    const formattedNumber = Math.abs(amount).toFixed(2);

    return isNegative ? `-${symbol}${formattedNumber}` : `${symbol}${formattedNumber}`;
};

/**
 * Calculates the rounded subtotal, tax amount, and final total for a given tax rate.
 *
 * @param {number} subtotal The base monetary amount before tax.
 * @param {number} [rate=0.15] The tax rate expressed as a decimal.
 * @returns {{subtotal: number, iva: number, total: number}} An object with rounded subtotal, iva, and total values.
 */
export const calculateIVA = (subtotal, rate = 0.15) => {
    const cleanSubtotal = roundToTwo(subtotal);
    const iva = roundToTwo(cleanSubtotal * rate);
    const total = roundToTwo(cleanSubtotal + iva);

    return {
        subtotal: cleanSubtotal,
        iva,
        total,
    };
};

/**
 * Trims extra whitespace, collapses internal spaces, and converts text to Title Case.
 *
 * @param {string} [rawText=""] The input string to normalize.
 * @returns {string} The normalized Title Case string, or an empty string if blank.
 */
export const normalizeText = (rawText = "") => {
    const cleaned = rawText.trim().replace(/\s+/g, " ");

    if (!cleaned) return "";

    return cleaned
        .toLowerCase()
        .split(" ")
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ");
};

/**
 * Searches for a product by its strict numeric identifier within a collection.
 * Returns the matching product object if found, or null otherwise.
 *
 * @param {Array<Object>} items The list of product objects to search through.
 * @param {number} id The numeric identifier of the target product.
 * @returns {Object|null} The matching product object, or null if no match exists.
 */
export const findProductById = (items, id) => {
    return items.find((product) => product.id === id) ?? null;
};

/**
 * Calculates a discounted price rounded to two decimal places and attaches
 * originalPrice and discountApplied metadata to each item without mutating
 * the original array.
 *
 * @param {Array<Object>} items The list of product objects to discount.
 * @param {number} [discountRate=0.10] The discount rate expressed as a decimal.
 * @returns {Array<Object>} A new array of product objects with updated pricing fields.
 */
export const applyDiscount = (items, discountRate = 0.10) => {
    return items.map((product) => ({
        ...product,
        originalPrice: product.price,
        price: roundToTwo(product.price * (1 - discountRate)),
        discountApplied: discountRate > 0,
    }));
};

/**
 * Calculates the total monetary amount of a shopping cart against a product catalog.
 * Ignores items that do not exist in the catalog or have a quantity of zero or less.
 *
 * @param {Array<Object>} cartItems The list of shopping cart items containing product references and quantities.
 * @param {Array<Object>} catalog The list of available catalog product objects.
 * @returns {number} The final cart total rounded to at most two decimal places.
 */
export const calculateCartTotal = (cartItems, catalog) => {
    const rawTotal = cartItems.reduce((acc, item) => {
        const product = findProductById(catalog, item.productId);
        if (!product || item.quantity <= 0) return acc;

        return acc + product.price * item.quantity;
    }, 0);

    return roundToTwo(rawTotal);
};

/**
 * Partially updates a matching product in a catalog without mutating the input array or objects.
 * Preserves the original product identifier even if changes contains an id property.
 *
 * @param {Array<Object>} items The catalog of product objects.
 * @param {number} id The strict numeric identifier of the product to update.
 * @param {Object} [changes={}] An object containing the fields to update.
 * @returns {Array<Object>} A new catalog array with the updated product object if found.
 */
export const updateProductImmutable = (items, id, changes = {}) => {
    return items.map((product) =>
        product.id === id
            ? { ...product, ...changes, id: product.id }
            : product
    );
};

/**
 * Merges an incoming batch of products into a base catalog without duplicating identifiers
 * or mutating either input array. Updates existing items and appends new items as fresh copies.
 *
 * @param {Array<Object>} baseCatalog The original catalog of product objects.
 * @param {Array<Object>} [incomingItems=[]] The incoming product objects to merge.
 * @returns {Array<Object>} A new merged catalog array.
 */
export const mergeCatalogs = (baseCatalog, incomingItems = []) => {
    return incomingItems.reduce((acc, item) => {
        const existing = findProductById(acc, item.id);

        if (existing) {
            return updateProductImmutable(acc, item.id, item);
        }

        return [...acc, { ...item }];
    }, [...baseCatalog]);
};

/**
 * Extracts key highlight fields from a product object using parameter destructuring,
 * property renaming, default values, and rest syntax.
 *
 * @param {Object} [product={}] The product object to extract highlights from.
 * @returns {{title: string, formattedPrice: string, inStock: boolean, metaKeysCount: number}} A summary object with formatted highlights.
 */
export const extractProductHighlights = ({
    name: title = "Sin nombre",
    price = 0,
    stock = 0,
    ...meta
} = {}) => {
    return {
        title,
        formattedPrice: formatUSD(price),
        inStock: stock > 0,
        metaKeysCount: Object.keys(meta).length,
    };
};

/**
 * Builds a complete invoice breakdown object by composing text normalization,
 * cart total calculation, tax calculation, shipping rounding, and currency formatting.
 *
 * @param {Object} [order={}] The order configuration object.
 * @returns {{customer: string, itemLines: number, subtotal: number, iva: number, shipping: number, grandTotal: number, formattedTotal: string}} The complete invoice breakdown.
 */
export const buildInvoiceBreakdown = ({
    customer = "Cliente",
    cart = [],
    catalog = [],
    taxRate = 0.15,
    shipping = 0,
} = {}) => {
    const cleanCustomer = normalizeText(customer) || "Cliente";
    const subtotal = calculateCartTotal(cart, catalog);
    const { iva, total: totalWithTax } = calculateIVA(subtotal, taxRate);
    const cleanShipping = roundToTwo(shipping);
    const grandTotal = roundToTwo(totalWithTax + cleanShipping);

    return {
        customer: cleanCustomer,
        itemLines: cart.length,
        subtotal,
        iva,
        shipping: cleanShipping,
        grandTotal,
        formattedTotal: formatUSD(grandTotal),
    };
};
