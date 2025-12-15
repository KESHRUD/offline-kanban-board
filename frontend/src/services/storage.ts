import type { Task, Column, Deck, DailyGoal, User } from '../types';

const DB_NAME = 'GalileeOS_DB';
const DB_VERSION = 5; 
const STORE_TASKS = 'tasks';
const STORE_COLUMNS = 'columns';
const STORE_DECKS = 'decks';
const STORE_GOALS = 'goals';

export class StorageService {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_TASKS)) {
          db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_COLUMNS)) {
          db.createObjectStore(STORE_COLUMNS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_DECKS)) {
          db.createObjectStore(STORE_DECKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_GOALS)) {
          db.createObjectStore(STORE_GOALS, { keyPath: 'id' });
        }
      };
    });
  }

  // --- TASKS ---

  async getAllTasks(): Promise<Task[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TASKS, 'readonly');
      const store = transaction.objectStore(STORE_TASKS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTask(task: Task): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TASKS, 'readwrite');
      const store = transaction.objectStore(STORE_TASKS);
      const request = store.put(task);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TASKS, 'readwrite');
      const store = transaction.objectStore(STORE_TASKS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- COLUMNS ---

  async getAllColumns(): Promise<Column[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_COLUMNS, 'readonly');
      const store = transaction.objectStore(STORE_COLUMNS);
      const request = store.getAll();
      request.onsuccess = () => {
        const cols = request.result || [];
        resolve(cols.sort((a, b) => a.order - b.order));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveColumn(column: Column): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_COLUMNS, 'readwrite');
      const store = transaction.objectStore(STORE_COLUMNS);
      const request = store.put(column);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteColumn(id: string): Promise<void> {
     const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_COLUMNS, 'readwrite');
      const store = transaction.objectStore(STORE_COLUMNS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- FLASHCARD DECKS ---

  async getAllDecks(): Promise<Deck[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_DECKS, 'readonly');
        const store = transaction.objectStore(STORE_DECKS);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } catch (e) {
        resolve([]); // Store might not exist yet on upgrade
      }
    });
  }

  async saveDeck(deck: Deck): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_DECKS, 'readwrite');
      const store = transaction.objectStore(STORE_DECKS);
      const request = store.put(deck);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDeck(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_DECKS, 'readwrite');
        const store = transaction.objectStore(STORE_DECKS);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
  }

  // --- GOALS & PROGRESS ---

  async getDailyGoal(): Promise<DailyGoal> {
    const db = await this.dbPromise;
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_GOALS, 'readonly');
        const store = transaction.objectStore(STORE_GOALS);
        const request = store.get('daily_goal');
        
        request.onsuccess = () => {
          const today = new Date().setHours(0,0,0,0);
          const result = request.result as DailyGoal;
          
          if (!result) {
            resolve({ id: 'daily_goal', target: 20, progress: 0, lastUpdated: today, streak: 0 } as any);
          } else if (result.lastUpdated < today) {
            const oneDay = 24 * 60 * 60 * 1000;
            const isConsecutive = (today - result.lastUpdated) <= oneDay;
            const newStreak = isConsecutive && result.progress >= result.target ? result.streak : (isConsecutive ? result.streak : 0);
            resolve({ ...result, progress: 0, lastUpdated: today, streak: newStreak });
          } else {
            resolve(result);
          }
        };
        request.onerror = () => reject(request.error);
      } catch(e) {
         resolve({ target: 20, progress: 0, lastUpdated: Date.now(), streak: 0 });
      }
    });
  }

  async saveDailyGoal(goal: DailyGoal): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_GOALS, 'readwrite');
      const store = transaction.objectStore(STORE_GOALS);
      const request = store.put({ ...goal, id: 'daily_goal' });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- SEEDING ---

  async seedIfNeeded(): Promise<void> {
    const columns = await this.getAllColumns();
    if (columns.length === 0) {
        await this.saveColumn({ id: 'todo', title: 'À Faire', order: 0 });
        await this.saveColumn({ id: 'inprogress', title: 'En Cours', order: 1 });
        await this.saveColumn({ id: 'done', title: 'Validé', order: 2 });
    }

    const tasks = await this.getAllTasks();
    if (tasks.length === 0) {
      await this.saveTask({
        id: 't-1',
        title: 'Révisions Partiels S2',
        description: 'Préparer les fiches de révision pour la Thermodynamique et le Traitement du Signal.',
        columnId: 'todo',
        tags: ['examens', 'urgent'],
        priority: 'high',
        createdAt: Date.now(),
        subtasks: [
            { id: 'st-1', title: 'Relire cours Thermo Chap 1-3', completed: true },
            { id: 'st-2', title: 'Faire annales 2023', completed: false }
        ],
        comments: []
      });
    }

    const decks = await this.getAllDecks();
    if (decks.length === 0) {
        await this.saveDeck({
            id: 'deck-1',
            title: 'Thermodynamique',
            subject: 'Physique',
            coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
            cards: [
                { 
                  id: 'c1', 
                  question: 'Quelle est la première loi de la thermodynamique ?', 
                  answer: 'Conservation de l\'énergie : dU = \u03B4Q + \u03B4W', 
                  difficulty: 'medium',
                  streak: 0,
                  easeFactor: 2.5
                },
                { 
                  id: 'c2', 
                  question: 'Définir l\'entropie (S).', 
                  answer: 'Mesure du désordre d\'un système. \u0394S >= 0 pour un système isolé.', 
                  difficulty: 'hard',
                  streak: 0,
                  easeFactor: 2.5
                }
            ]
        });
    }
  }
}

export const db = new StorageService();
