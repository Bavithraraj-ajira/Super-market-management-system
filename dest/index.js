"use strict";
class Inventory {
    constructor(inventoryName) {
        this.products = [];
        this.inventoryName = inventoryName;
        this.inventoryId = ++Inventory.counter;
    }
    addProduct(product) {
        this.products.push(product);
    }
}
Inventory.counter = 0;
class Product {
    constructor(productId, productName, quantity, pricePerQuantity) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.pricePerQuantity = pricePerQuantity;
        Product.counter++;
    }
    getProductId() {
        return this.productId;
    }
    getProductName() {
        return this.productName;
    }
    getPricePerQuantity() {
        return this.pricePerQuantity;
    }
    getQuantity() {
        return this.quantity;
    }
    deduceQuantity(quantityDeduced) {
        this.quantity -= quantityDeduced;
    }
    increaseQuantity(quantityIncreased) {
        this.quantity += quantityIncreased;
    }
}
Product.counter = 0;
class Bill {
    constructor() {
        this.products = [];
        this.quantities = [];
        this.saleId = ++Bill.counter;
    }
    addProduct(product, quantity) {
        if (product && product.getQuantity() >= quantity) {
            this.products.push(product);
            this.quantities.push(quantity);
            product.deduceQuantity(quantity);
        }
        else {
            console.log(`Product ID ${product.getProductId()} is out of stock or does not have enough quantity.`);
        }
    }
    calculateTotal() {
        let total = 0;
        this.products.forEach((product, index) => {
            total += product.getPricePerQuantity() * this.quantities[index];
        });
        return total;
    }
    getProducts() {
        return this.products;
    }
    getQuantities() {
        return this.quantities;
    }
    getSaleId() {
        return this.saleId;
    }
}
Bill.counter = 0;
class BillGenerator {
    static generateBill(bill) {
        console.log("== Bill ==");
        const products = bill.getProducts();
        const quantities = bill.getQuantities();
        products.forEach((product, index) => {
            const totalPrice = product.getPricePerQuantity() * quantities[index];
            console.log(`${product.getProductId()} - ${product.getProductName()} - ${quantities[index]} - ${product.getPricePerQuantity()} - N/A - ${totalPrice}`);
        });
        const totalAmount = bill.calculateTotal();
        console.log("== Total ==");
        console.log(totalAmount);
        console.log("========");
    }
}
