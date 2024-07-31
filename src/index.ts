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
  private static counter = 0;

  constructor(billItems: BillItems) {
    this.saleId = ++Bill.counter;
    this.billItems = billItems;
  }

  public calculateTotal(): number {
    return this.billItems.calculateTotal();
  }

  public generateBill(): void {
    console.log("== Bill ==");
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
}

class Customer {
  private static count: number = 0;
  private customerId: number;
  private name: string;
  private address: string;
  private phone: string;
  private bills: Bill[] = [];
  private lifeTimeValue: number = 0;

  constructor(name: string, address: string, phone: string) {
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
