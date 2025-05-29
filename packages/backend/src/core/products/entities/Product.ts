export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  
  constructor(id: string, name: string, description: string, price: number, stock: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }
}

