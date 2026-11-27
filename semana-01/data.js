export const products = [
    { id: 1, name: "Mouse Inalámbrico Pro", category: "Periféricos", price: 25.00, stock: 12 },
    { id: 2, name: "Teclado Mecánico 65%", category: "Periféricos", price: 68.50, stock: 0 },
    { id: 3, name: "Audífonos Studio ANC", category: "Audio", price: 89.90, stock: 5 },
    { id: 4, name: "Micrófono USB Condensador", category: "Audio", price: 54.00, stock: 3 },
    { id: 5, name: "SSD NVMe 1TB", category: "Almacenamiento", price: 79.00, stock: 8 },
    { id: 6, name: "Memoria USB 128GB", category: "Almacenamiento", price: 14.50, stock: 0 },
    { id: 7, name: "Hub USB-C 7 en 1", category: "Periféricos", price: 32.00, stock: 9 },
    { id: 8, name: "Switch Gigabit 5 Puertos", category: "Redes", price: 22.00, stock: 6 },
    { id: 9, name: "Router Wi-Fi 6 Dual Band", category: "Redes", price: 95.00, stock: 0 },
    { id: 10, name: "Cable Patch Cat6 5m", category: "Redes", price: 6.50, stock: 20 },
];

export const sampleCart = [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
    { productId: 10, quantity: 3 },
];

export const cartWithEdgeCases = [
    { productId: 5, quantity: 1 },
    { productId: 999, quantity: 4 },
    { productId: 1, quantity: 0 },
    { productId: 4, quantity: -2 },
    { productId: 8, quantity: 2 },
];
