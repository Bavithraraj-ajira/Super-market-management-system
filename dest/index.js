"use strict";
class Inventory {
    constructor(inventoryName) {
        this.products = new Map();
        this.inventoryName = inventoryName;
        this.inventoryId = ++Inventory.counter;
    }
    addProduct(product, quantity) {
        this.products.set(product.getProductId(), { product, quantity });
    }
    getProductQuantity(productId) {
        return this.products.has(productId) ? this.products.get(productId).quantity : 0;
    }
    updateProductQuantity(productId, quantity) {
        if (this.products.has(productId)) {
            let productInfo = this.products.get(productId);
            productInfo.quantity -= quantity;
            this.products.set(productId, productInfo);
        }
        else {
            console.log("Product ID not found");
        }
    }
    getProduct(productId) {
        return this.products.has(productId) ? this.products.get(productId).product : undefined;
    }
}
Inventory.counter = 0;
class Product {
    constructor(productName, pricePerQuantity) {
        this.productId = ++Product.counter;
        this.productName = productName;
        this.pricePerQuantity = pricePerQuantity;
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
}
Product.counter = 0;
class BillItems {
    constructor(inventory) {
        this.items = new Map();
        this.inventory = inventory;
    }
    addProduct(product, quantity) {
        const availableQuantity = this.inventory.getProductQuantity(product.getProductId());
        if (availableQuantity >= quantity) {
            if (this.items.has(product)) {
                this.items.set(product, this.items.get(product) + quantity);
            }
            else {
                this.items.set(product, quantity);
            }
            this.inventory.updateProductQuantity(product.getProductId(), -quantity);
        }
        else {
            console.log(`Product ID ${product.getProductId()} is out of stock or does not have enough quantity. Available quantity: ${availableQuantity}`);
        }
    }
    getItems() {
        return this.items;
    }
    calculateTotal() {
        let total = 0;
        this.items.forEach((quantity, product) => {
            total += product.getPricePerQuantity() * quantity;
        });
        return total;
    }
}
class Bill {
    constructor(billItems) {
        this.saleId = ++Bill.counter;
        this.billItems = billItems;
    }
    calculateTotal() {
        return this.billItems.calculateTotal();
    }
    generateBill() {
        console.log("== Bill ==");
        this.billItems.getItems().forEach((quantity, product) => {
            const totalPrice = product.getPricePerQuantity() * quantity;
            console.log(`${product.getProductId()} - ${product.getProductName()} - ${quantity} - ${product.getPricePerQuantity()} - ${totalPrice}`);
        });
        const totalAmount = this.calculateTotal();
        console.log("== Total ==");
        console.log(totalAmount);
        console.log("========");
    }
    getSaleId() {
        return this.saleId;
    }
    getBillItems() {
        return this.billItems;
    }
}
Bill.counter = 0;
class Customer {
    constructor(name, address, phone) {
        this.bills = [];
        this.lifeTimeValue = 0;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.customerId = ++Customer.count;
    }
    getCustomerId() {
        return this.customerId;
    }
    getName() {
        return this.name;
    }
    getAddress() {
        return this.address;
    }
    getPhone() {
        return this.phone;
    }
    getLifeTimeValue() {
        return this.lifeTimeValue;
    }
    getBills() {
        return this.bills;
    }
    setName(name) {
        this.name = name;
    }
    setAddress(address) {
        this.address = address;
    }
    setPhone(phone) {
        this.phone = phone;
    }
    setLifeTimeValue(value) {
        this.lifeTimeValue = value;
    }
    addLifeTimeValue(value) {
        this.lifeTimeValue += value;
    }
    addBill(bill) {
        this.bills.push(bill);
    }
}
Customer.count = 0;
