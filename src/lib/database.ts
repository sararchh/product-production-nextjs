import { Product } from '@/modules/products';
import { promises as fs } from 'fs';
import path from 'path';

class Database {
  private static instance: Database;
  private _products: Product[] = [];
  private readonly dataPath = path.join(process.cwd(), 'data', 'products.json');

  private constructor() {
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async loadData(): Promise<void> {
    try {
      const dataDir = path.dirname(this.dataPath);
      await fs.mkdir(dataDir, { recursive: true });
      
      const data = await fs.readFile(this.dataPath, 'utf-8');
      this._products = JSON.parse(data);
    } catch {
      this._products = [];
      await this.saveData();
    }
  }

  private async saveData(): Promise<void> {
    try {
      const dataDir = path.dirname(this.dataPath);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.dataPath, JSON.stringify(this._products, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  public get products(): Product[] {
    return this._products;
  }

  public async getProducts(): Promise<Product[]> {
    if (this._products.length === 0) {
      await this.loadData();
    }
    return this._products;
  }

  public async addProduct(product: Product): Promise<void> {
    this._products.push(product);
    await this.saveData();
  }

  public async updateProduct(id: string, updatedProduct: Product): Promise<boolean> {
    const index = this._products.findIndex(p => p.id === id);
    if (index !== -1) {
      this._products[index] = updatedProduct;
      await this.saveData();
      return true;
    }
    return false;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const index = this._products.findIndex(p => p.id === id);
    if (index !== -1) {
      this._products.splice(index, 1);
      await this.saveData();
      return true;
    }
    return false;
  }

  public findProduct(id: string): Product | undefined {
    return this._products.find(p => p.id === id);
  }

  public async findProductAsync(id: string): Promise<Product | undefined> {
    if (this._products.length === 0) {
      await this.loadData();
    }
    return this._products.find(p => p.id === id);
  }
}

export const database = Database.getInstance();
