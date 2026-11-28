import { products } from "./data.js";
import { formatUSD } from "./calculations.js";
import {
    searchProducts,
    filterByPriceRange,
    sortProductsImmutable,
    queryCatalog,
} from "./engine.js";

// =======================================================
// ARNÉS DE VERIFICACIÓN DEL MINI-MOTOR (NO MODIFICAR)
// =======================================================

const originalSnapshot = JSON.stringify(products);

// Reto 1: searchProducts
const usbSearch = searchProducts(products, "usb");
const audioSearch = searchProducts(products, "  AUDIO ");
const emptySearch = searchProducts(products, "   ");
const noMatchSearch = searchProducts(products, "monitor");

// Reto 2: filterByPriceRange
const midRange = filterByPriceRange(products, 20, 60);
const inclusiveRange = filterByPriceRange(products, 25, 79);
const openRange = filterByPriceRange(products, 80);
const invertedRange = filterByPriceRange(products, 100, 50);

// Reto 3: sortProductsImmutable
const sortedPriceAsc = sortProductsImmutable(products, "price-asc");
const sortedPriceDesc = sortProductsImmutable(products, "price-desc");
const sortedNameAsc = sortProductsImmutable(products, "name-asc");
const sortedStockDesc = sortProductsImmutable(products, "stock-desc");
const unknownSort = sortProductsImmutable(products, "invalid-option");

// Reto 4: queryCatalog
const usbInStock = queryCatalog(products, {
    query: "usb",
    minPrice: 10,
    maxPrice: 60,
    onlyInStock: true,
    sortBy: "price-asc",
});
const usbAllDesc = queryCatalog(products, {
    query: "usb",
    minPrice: 10,
    maxPrice: 60,
    onlyInStock: false,
    sortBy: "price-desc",
});
const defaultQuery = queryCatalog(products);
const emptyQuery = queryCatalog(products, {
    query: "redes",
    minPrice: 50,
    onlyInStock: true,
});

const testResults = [
    // Reto 1: searchProducts
    { reto: "1. search por nombre ('usb')", esperado: 3, obtenido: usbSearch?.length },
    { reto: "1. search por categoría y espacios ('  AUDIO ')", esperado: 2, obtenido: audioSearch?.length },
    { reto: "1. search vacío devuelve copia completa", esperado: true, obtenido: emptySearch?.length === 10 && emptySearch !== products },
    { reto: "1. search sin coincidencias", esperado: 0, obtenido: noMatchSearch?.length },

    // Reto 2: filterByPriceRange
    { reto: "2. rango 20 a 60", esperado: 4, obtenido: midRange?.length },
    { reto: "2. rango inclusivo 25 a 79", esperado: 5, obtenido: inclusiveRange?.length },
    { reto: "2. rango abierto desde 80 (default max)", esperado: 2, obtenido: openRange?.length },
    { reto: "2. rango invertido (100 a 50)", esperado: 0, obtenido: invertedRange?.length },

    // Reto 3: sortProductsImmutable
    { reto: "3. sort price-asc primero", esperado: "Cable Patch Cat6 5m", obtenido: sortedPriceAsc?.[0]?.name },
    { reto: "3. sort price-desc primero", esperado: "Router Wi-Fi 6 Dual Band", obtenido: sortedPriceDesc?.[0]?.name },
    { reto: "3. sort name-asc primero", esperado: "Audífonos Studio ANC", obtenido: sortedNameAsc?.[0]?.name },
    { reto: "3. sort name-asc último", esperado: "Teclado Mecánico 65%", obtenido: sortedNameAsc?.[9]?.name },
    { reto: "3. sort stock-desc primero", esperado: 20, obtenido: sortedStockDesc?.[0]?.stock },
    { reto: "3. sort no muta orden original", esperado: true, obtenido: sortedPriceAsc !== products && products[0].id === 1 },
    { reto: "3. sort opción desconocida mantiene orden", esperado: 1, obtenido: unknownSort?.[0]?.id },

    // Reto 4: queryCatalog
    { reto: "4. motor combinado (totalMatches)", esperado: 2, obtenido: usbInStock?.totalMatches },
    { reto: "4. motor combinado primero (price-asc)", esperado: "Hub USB-C 7 en 1", obtenido: usbInStock?.items?.[0]?.name },
    { reto: "4. motor combinado segundo (price-asc)", esperado: "Micrófono USB Condensador", obtenido: usbInStock?.items?.[1]?.name },
    { reto: "4. motor con agotados y price-desc (total)", esperado: 3, obtenido: usbAllDesc?.totalMatches },
    { reto: "4. motor con agotados último ID", esperado: 6, obtenido: usbAllDesc?.items?.[2]?.id },
    {
        reto: "4. motor con defaults (10 ítems, ID 10 primero)",
        esperado: "10|price-asc|10",
        obtenido: `${defaultQuery?.totalMatches}|${defaultQuery?.appliedSort}|${defaultQuery?.items?.[0]?.id}`,
    },
    { reto: "4. motor sin resultados", esperado: 0, obtenido: emptyQuery?.totalMatches },

    // Auditoría global de inmutabilidad
    {
        reto: "5. Catálogo original intacto",
        esperado: true,
        obtenido: JSON.stringify(products) === originalSnapshot,
    },
].map((test) => ({
    ...test,
    pasa: test.esperado === test.obtenido,
}));

console.table(testResults);

// Vista previa real del mini-motor en consola
if (usbInStock?.items?.length) {
    console.log(`\nConsulta demo ("usb", $10-$60, en stock, ${usbInStock.appliedSort}):`);
    console.table(
        usbInStock.items.map(({ id, name, category, price, stock }) => ({
            id,
            producto: name,
            categoria: category,
            precio: formatUSD(price),
            stock,
        }))
    );
}