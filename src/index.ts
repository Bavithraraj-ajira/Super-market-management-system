import promptSync from 'prompt-sync'

class Inventory {
  private inventoryId: number;
  private inventoryName: string;
  private products: Map<number, { product: Product, quantity: number }> = new Map();
  private static counter = 0;

  constructor(inventoryName: string) {
    this.inventoryName = inventoryName;
    this.inventoryId = ++Inventory.counter;
  }

  public addProduct(product: Product, quantity: number): void {
    this.products.set(product.getProductId(), { product, quantity });
  }

  public getProductQuantity(productId: number): number {
    return this.products.has(productId) ? this.products.get(productId)!.quantity : 0;
  }

  public updateProductQuantity(productId: number, quantity: number): void {
    if (this.products.has(productId)) {
      let productInfo = this.products.get(productId)!;
      productInfo.quantity -= quantity; 
      this.products.set(productId, productInfo);
    } else {
      console.log("Product ID not found");
    }
  }

  public getProduct(productId: number): Product | undefined {
    return this.products.has(productId) ? this.products.get(productId)!.product : undefined;
  }

  public getInventoryId(): number{
    return this.inventoryId;
  }
}

class Product {
  private static counter = 0;
  private productId: number;
  private productName: string;
  private pricePerQuantity: number;

  constructor(productName: string, pricePerQuantity: number) {
    this.productId = ++Product.counter;
    this.productName = productName;
    this.pricePerQuantity = pricePerQuantity;
  }

  public getProductId(): number {
    return this.productId;
  }

  public getProductName(): string {
    return this.productName;
  }

  public getPricePerQuantity(): number {
    return this.pricePerQuantity;
  }
}

class BillItems {
  private items: Map<Product, number> = new Map();
  private inventory: Inventory;

  constructor(inventory: Inventory) {
    this.inventory = inventory;
  }

  public addProduct(product: Product, quantity: number): void {
    const availableQuantity = this.inventory.getProductQuantity(product.getProductId());
    if (availableQuantity >= quantity) {
      if (this.items.has(product)) {
        this.items.set(product, this.items.get(product)! + quantity);
      } else {
        this.items.set(product, quantity);
      }
      this.inventory.updateProductQuantity(product.getProductId(), -quantity);
    } else {
      console.log(`Product ID ${product.getProductId()} is out of stock or does not have enough quantity. Available quantity: ${availableQuantity}`);
    }
  }

  public getItems(): Map<Product, number> {
    return this.items;
  }

  public calculateTotal(): number {
    let total = 0;
    this.items.forEach((quantity, product) => {
      total += product.getPricePerQuantity() * quantity;
    });
    return total;
  }
}

class Bill {
  private saleId: number;
  private billItems: BillItems;
  private customer: Customer;
  private static counter = 0;

  constructor(billItems: BillItems, customer: Customer) {
    this.saleId = ++Bill.counter;
    this.billItems = billItems;
    this.customer = customer;
  }

  public calculateTotal(): number {
    return this.billItems.calculateTotal();
  }

  public generateBill(): void {
    console.log("== Bill ==");
    console.log(`Customer: ${this.customer.getName()} - ${this.customer.getPhone()}`);
    this.billItems.getItems().forEach((quantity, product) => {
      const totalPrice = product.getPricePerQuantity() * quantity;
      console.log(
        `${product.getProductId()} - ${product.getProductName()} - ${quantity} - ${product.getPricePerQuantity()} - ${totalPrice}`
      );
    });
    const totalAmount = this.calculateTotal();
    console.log("== Total ==");
    console.log(totalAmount);
    console.log("========");
  }

  public getSaleId(): number {
    return this.saleId;
  }

  public getBillItems(): BillItems {
    return this.billItems;
  }

  public getCustomer(): Customer {
    return this.customer;
  }
}

class Customer {
  private static count: number = 0;
  private customerId: number;
  private name: string;
  private address: string;
  private phone: string;
  private bills: Bill[] = [];
  private lifeTimeValue: number = 0;

  constructor(name: string, phone: string,address: string) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.customerId = ++Customer.count;
  }

  public getCustomerId(): number {
    return this.customerId;
  }

  public getName(): string {
    return this.name;
  }

  public getAddress(): string {
    return this.address;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getLifeTimeValue(): number {
    return this.lifeTimeValue;
  }

  public getBills(): any[] {
    return this.bills;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public setLifeTimeValue(value: number): void {
    this.lifeTimeValue = value;
  }

  public addLifeTimeValue(value: number): void {
    this.lifeTimeValue += value;
  }

  public addBill(bill: any): void {
    this.bills.push(bill);
  }
}


function main(){
  const promt = promptSync();
  let customers:Customer[]=[];
  let inventories: Inventory[] = [];
  let inventory: Inventory | undefined;
  let inventoryId: number;
  while(true){
      console.log("1. Add Customer");
      console.log("2. Add Inventory");
      console.log("3. Add Product");
      console.log("4. Create a Bill");
      console.log("5. Exit");
      const input = promt("Enter an option");
      switch(input){
        case "1":
          let customer = new Customer(promt("Enter Customer Name:"), promt("Enter phone:"),promt("Enter Address:"));
          customers.push(customer);
          break;
        
        case "2":
          let newInventory = new Inventory(promt("Enter Inventory Name"));
          inventories.push(newInventory);
          break;

        case "3":
          let product = new Product(promt("Enter Product Name"), parseInt(promt("Enter Product Price")));
          let inventoryId1 = parseInt(promt("Enter Inventory ID"));
          inventory = findInventory(inventoryId1,inventories);
          if (inventory) {
            let quantity = parseInt(promt("Enter Quantity"));
            inventory.addProduct(product, quantity);
          } else {
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
                } else {
                  console.log("Not enough quantity available");
                }
              } else {
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
            } else {
              console.log("Customer not found");
            }
          } else {
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

function findInventory(inverntoryId: number,inventories: Inventory[]):Inventory | undefined {
  return inventories.find(i => i.getInventoryId() === inverntoryId);
}