import sqlite3 from 'sqlite3';
import path from 'path';
import { Product } from '@/modules/products/types';
import { Production } from '@/modules/productions/types';

const dbPath = path.join(process.cwd(), 'database.sqlite');

sqlite3.verbose();

interface ProductionWithProductName extends Production {
  productName?: string;
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  private initTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL DEFAULT 0,
        minProduction INTEGER NOT NULL,
        maxProduction INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS productions (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        productionDate TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        justification TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (productId) REFERENCES products (id)
      )
    `);
  }

  createProduct(product: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      const { id, name, description, price, minProduction, maxProduction, active, createdAt, updatedAt } = product;
      
      this.db.run(
        `INSERT INTO products (id, name, description, price, minProduction, maxProduction, active, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, description, price, minProduction, maxProduction, active, createdAt, updatedAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, description, price, minProduction, maxProduction, active, createdAt, updatedAt });
          }
        }
      );
    });
  }

  getProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM products ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Product[]);
        }
      });
    });
  }

  getProductById(id: string): Promise<Product | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Product | undefined);
        }
      });
    });
  }

  updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return new Promise((resolve, reject) => {
      const { name, description, price, minProduction, maxProduction, updatedAt } = product;
      
      this.db.run(
        `UPDATE products SET name = ?, description = ?, price = ?, minProduction = ?, maxProduction = ?, updatedAt = ? 
         WHERE id = ?`,
        [name, description, price, minProduction, maxProduction, updatedAt, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, description, price, minProduction, maxProduction, updatedAt } as Product);
          }
        }
      );
    });
  }

  updateProductFlag(id: string, active: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString();
      
      this.db.run(
        'UPDATE products SET active = ?, updatedAt = ? WHERE id = ?',
        [active, updatedAt, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  deleteProduct(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createProduction(production: Production): Promise<Production> {
    return new Promise((resolve, reject) => {
      const { id, productId, quantity, productionDate, active, justification, createdAt, updatedAt } = production;
      
      this.db.run(
        `INSERT INTO productions (id, productId, quantity, productionDate, active, justification, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, productId, quantity, productionDate, active, justification, createdAt, updatedAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, productId, quantity, productionDate, active, justification, createdAt, updatedAt });
          }
        }
      );
    });
  }

  getProductions(): Promise<ProductionWithProductName[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT p.*, pr.name as productName 
        FROM productions p 
        LEFT JOIN products pr ON p.productId = pr.id 
        ORDER BY p.createdAt DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as ProductionWithProductName[]);
        }
      });
    });
  }

  updateProductionFlag(id: string, active: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString();
      
      this.db.run(
        'UPDATE productions SET active = ?, updatedAt = ? WHERE id = ?',
        [active, updatedAt, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
        resolve();
      });
    });
  }
}

let dbInstance: Database | null = null;

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}

export default Database;
