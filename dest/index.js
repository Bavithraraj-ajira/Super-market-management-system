"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
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
    getInventoryId() {
        return this.inventoryId;
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
    constructor(billItems, customer) {
        this.saleId = ++Bill.counter;
        this.billItems = billItems;
        this.customer = customer;
    }
    calculateTotal() {
        return this.billItems.calculateTotal();
    }
    generateBill() {
        console.log("== Bill ==");
        console.log(`Customer: ${this.customer.getName()} - ${this.customer.getPhone()}`);
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
    getCustomer() {
        return this.customer;
    }
}
Bill.counter = 0;
class Customer {
    constructor(name, phone, address) {
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
function main() {
    const promt = (0, prompt_sync_1.default)();
    let customers = [];
    let inventories = [];
    let inventory;
    let inventoryId;
    while (true) {
        console.log("1. Add Customer");
        console.log("2. Add Inventory");
        console.log("3. Add Product");
        console.log("4. Create a Bill");
        console.log("5. Exit");
        const input = promt("Enter an option");
        switch (input) {
            case "1":
                let customer = new Customer(promt("Enter Customer Name:"), promt("Enter phone:"), promt("Enter Address:"));
                customers.push(customer);
                break;
            case "2":
                let newInventory = new Inventory(promt("Enter Inventory Name"));
                inventories.push(newInventory);
                break;
            case "3":
                let product = new Product(promt("Enter Product Name"), parseInt(promt("Enter Product Price")));
                let inventoryId1 = parseInt(promt("Enter Inventory ID"));
                inventory = findInventory(inventoryId1, inventories);
                if (inventory) {
                    let quantity = parseInt(promt("Enter Quantity"));
                    inventory.addProduct(product, quantity);
                }
                else {
                    console.log("Inventory ID does not match");
                }
                break;
            case "4":
                let inventoryId = parseInt(promt("Enter Inventory ID"));
                inventory = findInventory(inventoryId, inventories);
                if (inventory) {
                    let billItem = new BillItems(inventory);
                    while (true) {
                        let productId = parseInt(promt("Enter Product ID (or 0 to finish):"));
                        if (productId === 0) {
                            break;
                        }
                        let product = inventory.getProduct(productId);
                        if (product) {
                            let availableQuantity = inventory.getProductQuantity(productId);
                            console.log(`Available quantity: ${availableQuantity}`);
                            let quantity = parseInt(promt("Enter Quantity"));
                            if (quantity <= availableQuantity) {
                                billItem.addProduct(product, quantity);
                            }
                            else {
                                console.log("Not enough quantity available");
                            }
                        }
                        else {
                            console.log("Product not found");
                        }
                    }
                    let customerId = parseInt(promt("Enter Customer ID"));
                    let customer = customers.find(c => c.getCustomerId() === customerId);
                    if (customer) {
                        let bill = new Bill(billItem, customer);
                        bill.generateBill();
                        customer.addBill(bill);
                        customer.addLifeTimeValue(bill.calculateTotal());
                    }
                    else {
                        console.log("Customer not found");
                    }
                }
                else {
                    console.log("Inventory ID does not match");
                }
                break;
            case "5":
                console.log("Good Bye...");
                break;
            default:
                console.log("Invalid option");
        }
    }
}
function findInventory(inverntoryId, inventories) {
    return inventories.find(i => i.getInventoryId() === inverntoryId);
}
