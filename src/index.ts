class Inventory {
  private inventoryId;
  private inventoryName: string;
  private products: Product[] = [];
  private static counter=0;

  constructor(inventoryName: string){
    this.inventoryName=inventoryName;
    this.inventoryId = ++Inventory.counter;
  }

  public addProduct(product: Product): void {
    this.products.push(product);
  }
}

class Product {
    private static counter = 0;
    private productId: number;
    private productName: string;
    private quantity: number;
    private pricePerQuantity: number;
  
    constructor(productId: number, productName: string, quantity: number, pricePerQuantity: number) {
      this.productId = productId;
      this.productName = productName;
      this.quantity = quantity;
      this.pricePerQuantity = pricePerQuantity;
      Product.counter++;
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
  
    public getQuantity(): number {
      return this.quantity;
    }

    public deduceQuantity(quantityDeduced: number) {
      this.quantity -= quantityDeduced;
    }
  
    public increaseQuantity(quantityIncreased: number) {
      this.quantity += quantityIncreased;
    }
}

class Bill {
  private saleId: number;
  private products: Product[] = [];
  private quantities: number[] = [];
  private static counter = 0;

  constructor() {
    this.saleId = ++Bill.counter;
  }

  public addProduct(product: Product, quantity: number): void {
    if (product && product.getQuantity() >= quantity) {
      this.products.push(product);
      this.quantities.push(quantity);
      product.deduceQuantity(quantity);
    } else {
      console.log(`Product ID ${product.getProductId()} is out of stock or does not have enough quantity.`);
    }
  }

  public calculateTotal(): number {
    let total = 0;
    this.products.forEach((product, index) => {
      total += product.getPricePerQuantity() * this.quantities[index];
    });
    return total;
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getQuantities(): number[] {
    return this.quantities;
  }

  public getSaleId(): number {
    return this.saleId;
  }
}

class BillGenerator {
  public static generateBill(bill: Bill): void {
    console.log("== Bill ==");
    const products = bill.getProducts();
    const quantities = bill.getQuantities();
    products.forEach((product, index) => {
      const totalPrice = product.getPricePerQuantity() * quantities[index];
      console.log(
        `${product.getProductId()} - ${product.getProductName()} - ${quantities[index]} - ${product.getPricePerQuantity()} - N/A - ${totalPrice}`
      );
    });
    const totalAmount = bill.calculateTotal();
    console.log("== Total ==");
    console.log(totalAmount);
    console.log("========");
  }
}

class Customer{
  private customerId:number;
  private name: string;
  private address: string;
  private phone: string;
  private bills: Bill[]=[];
  private lifeTimeValue: number=0;
  private static count: number=0;

  constructor(name: string, address: string, phone: string){
    this.name=name;
    this.address=address;
    this.phone=phone;
    this.customerId=++Customer.count;
  }

  public getCustomerId(): number{
    return this.customerId;
  }
  public getName():string{
    return this.name;
  }

  public getAddress():string{
    return this.address;
  }

  public getPhone():string{
    return this.phone;
  }

  public getLifeTimeValue():number{
    return this.lifeTimeValue;
  }

  public getBills(): Bill[]{
    return this.bills;
  }

  public setName(name: string): void{
    this.name=name;
  }

  public setAddress(address: string): void{
    this.address=address;
  }

  public setPhone(phone: string): void{
    this.phone=phone;
  }

  public setLifeTimeValue(value:number):void{
    this.lifeTimeValue=value;
  }

  public addLifeTimeValue(value: number): void{
    this.lifeTimeValue+=value;
  }

  public addBill(bill:Bill): void{
    this.bills.push(bill);
  }
  
}

