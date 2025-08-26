// Remove unused imports - this app uses local storage, not server storage
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

// This app uses local storage for persistence
// Server storage is not used in this implementation
export interface IStorage {
  // Placeholder interface - not used
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder class - not used
  }
}

export const storage = new MemStorage();
