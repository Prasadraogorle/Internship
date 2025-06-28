
// IndexedDB wrapper for local data storage
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'tenant' | 'owner' | 'admin';
  phone?: string;
  blocked?: boolean;
  createdAt: Date;
}

export interface House {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'studio';
  area: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: 'available' | 'rented' | 'sold';
  createdAt: Date;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  houseId: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

class Database {
  private dbName = 'HouseRentalDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains('houses')) {
          const houseStore = db.createObjectStore('houses', { keyPath: 'id' });
          houseStore.createIndex('ownerId', 'ownerId');
          houseStore.createIndex('status', 'status');
        }

        if (!db.objectStoreNames.contains('requests')) {
          const requestStore = db.createObjectStore('requests', { keyPath: 'id' });
          requestStore.createIndex('tenantId', 'tenantId');
          requestStore.createIndex('ownerId', 'ownerId');
          requestStore.createIndex('houseId', 'houseId');
        }
      };
    });
  }

  async addUser(user: User): Promise<void> {
    const transaction = this.db!.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    await store.add(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const transaction = this.db!.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async getAllUsers(): Promise<User[]> {
    const transaction = this.db!.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async updateUser(user: User): Promise<void> {
    const transaction = this.db!.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    await store.put(user);
  }

  async deleteUser(id: string): Promise<void> {
    const transaction = this.db!.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    await store.delete(id);
  }

  async addHouse(house: House): Promise<void> {
    const transaction = this.db!.transaction(['houses'], 'readwrite');
    const store = transaction.objectStore('houses');
    await store.add(house);
  }

  async getAllHouses(): Promise<House[]> {
    const transaction = this.db!.transaction(['houses'], 'readonly');
    const store = transaction.objectStore('houses');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async getHousesByOwner(ownerId: string): Promise<House[]> {
    const transaction = this.db!.transaction(['houses'], 'readonly');
    const store = transaction.objectStore('houses');
    const index = store.index('ownerId');
    const request = index.getAll(ownerId);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async updateHouse(id: string, houseData: { title: string; address: string; rent: number; bedrooms: number; bathrooms: number; description: string; images: string[]; ownerId: string; ownerName: string; ownerEmail: string; ownerPhone: string; }, house: House): Promise<void> {
    const transaction = this.db!.transaction(['houses'], 'readwrite');
    const store = transaction.objectStore('houses');
    await store.put(house);
  }

  async deleteHouse(id: string): Promise<void> {
    const transaction = this.db!.transaction(['houses'], 'readwrite');
    const store = transaction.objectStore('houses');
    await store.delete(id);
  }

  async addRequest(request: RentalRequest): Promise<void> {
    const transaction = this.db!.transaction(['requests'], 'readwrite');
    const store = transaction.objectStore('requests');
    await store.add(request);
  }

  async getRequestsByTenant(tenantId: string): Promise<RentalRequest[]> {
    const transaction = this.db!.transaction(['requests'], 'readonly');
    const store = transaction.objectStore('requests');
    const index = store.index('tenantId');
    const request = index.getAll(tenantId);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async getRequestsByOwner(ownerId: string): Promise<RentalRequest[]> {
    const transaction = this.db!.transaction(['requests'], 'readonly');
    const store = transaction.objectStore('requests');
    const index = store.index('ownerId');
    const request = index.getAll(ownerId);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async getAllRequests(): Promise<RentalRequest[]> {
    const transaction = this.db!.transaction(['requests'], 'readonly');
    const store = transaction.objectStore('requests');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async updateRequest(request: RentalRequest): Promise<void> {
    const transaction = this.db!.transaction(['requests'], 'readwrite');
    const store = transaction.objectStore('requests');
    await store.put(request);
  }
}

export const database = new Database();
