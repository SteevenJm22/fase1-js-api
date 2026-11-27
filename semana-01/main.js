import { products, sampleCart } from "./data.js";
import {
    updateProductImmutable,
    mergeCatalogs,
    extractProductHighlights,
    buildInvoiceBreakdown,
} from "./calculations.js";

// =======================================================
// ARNÉS DE VERIFICACIÓN MODULAR E INMUTABILIDAD
// =======================================================

const incomingBatch = [
    { id: 2, stock: 10, price: 64.00 },
    { id: 11, name: "Webcam 1080p Pro", category: "Periféricos", price: 45.00, stock: 7 },
];

const originalProductsSnapshot = JSON.stringify(products);
const originalIncomingSnapshot = JSON.stringify(incomingBatch);

// Reto 1
const updatedCatalog = updateProductImmutable(products, 2, {
    stock: 15,
    price: 65.00,
    id: 999,
});
const unchangedCatalog = updateProductImmutable(products, 999, { stock: 50 });

// Reto 2
const mergedCatalog = mergeCatalogs(products, incomingBatch);

// Reto 3
const highlightMouse = extractProductHighlights(products[0]);
const highlightPartial = extractProductHighlights({ name: "Prototipo" });

// Reto 4
const invoice = buildInvoiceBreakdown({
    customer: "  steeven   jaramillo ",
    cart: sampleCart,
    catalog: products,
    taxRate: 0.15,
    shipping: 4.5,
});
const emptyInvoice = buildInvoiceBreakdown({ customer: "   " });

const testResults = [
    // Reto 1: updateProductImmutable
    { reto: "1. spread actualiza stock", esperado: 15, obtenido: updatedCatalog[1]?.stock },
    { reto: "1. spread actualiza precio", esperado: 65, obtenido: updatedCatalog[1]?.price },
    { reto: "1. spread protege ID original", esperado: 2, obtenido: updatedCatalog[1]?.id },
    { reto: "1. nueva referencia del objeto", esperado: true, obtenido: updatedCatalog[1] !== products[1] },
    { reto: "1. ID inexistente devuelve nuevo array", esperado: true, obtenido: unchangedCatalog !== products && unchangedCatalog.length === 10 },

    // Reto 2: mergeCatalogs
    { reto: "2. merge total sin duplicar ID 2", esperado: 11, obtenido: mergedCatalog?.length },
    { reto: "2. merge actualiza stock de ID 2", esperado: 10, obtenido: mergedCatalog[1]?.stock },
    { reto: "2. merge conserva nombre de ID 2", esperado: "Teclado Mecánico 65%", obtenido: mergedCatalog[1]?.name },
    { reto: "2. merge agrega ID 11 al final", esperado: "Webcam 1080p Pro", obtenido: mergedCatalog[10]?.name },
    { reto: "2. merge clona el producto nuevo", esperado: true, obtenido: mergedCatalog[10] !== incomingBatch[1] },

    // Reto 3: extractProductHighlights
    { reto: "3. desestructuración renombra title", esperado: "Mouse Inalámbrico Pro", obtenido: highlightMouse?.title },
    { reto: "3. composición formatUSD", esperado: "$25.00", obtenido: highlightMouse?.formattedPrice },
    { reto: "3. rest captura 2 claves extra", esperado: 2, obtenido: highlightMouse?.metaKeysCount },
    { reto: "3. defaults en objeto parcial (precio)", esperado: "$0.00", obtenido: highlightPartial?.formattedPrice },
    { reto: "3. defaults en objeto parcial (stock)", esperado: false, obtenido: highlightPartial?.inStock },

    // Reto 4: buildInvoiceBreakdown
    { reto: "4. factura normaliza cliente", esperado: "Steeven Jaramillo", obtenido: invoice?.customer },
    { reto: "4. factura subtotal carrito", esperado: 159.4, obtenido: invoice?.subtotal },
    { reto: "4. factura IVA 15%", esperado: 23.91, obtenido: invoice?.iva },
    { reto: "4. factura grandTotal con envío", esperado: 187.81, obtenido: invoice?.grandTotal },
    { reto: "4. factura formattedTotal", esperado: "$187.81", obtenido: invoice?.formattedTotal },
    { reto: "4. factura vacía con respaldo", esperado: "Cliente|$0.00", obtenido: `${emptyInvoice?.customer}|${emptyInvoice?.formattedTotal}` },

    // Auditoría global de inmutabilidad
    {
        reto: "5. Catálogo original intacto",
        esperado: true,
        obtenido: JSON.stringify(products) === originalProductsSnapshot,
    },
    {
        reto: "5. Lote entrante intacto",
        esperado: true,
        obtenido: JSON.stringify(incomingBatch) === originalIncomingSnapshot,
    },
].map((test) => ({
    ...test,
    pasa: test.esperado === test.obtenido,
}));

console.table(testResults);