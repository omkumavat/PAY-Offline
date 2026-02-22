import { openDB } from 'idb';
// import dotenv from 'dotenv';
// dotenv.config();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
// import { useOnlineStatus } from '../hooks/useOnlineStatus';
const DB_NAME = 'PayOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

// const isOnline = useOnlineStatus();


export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
};

export const addTransaction = async (transaction) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const id = await store.add({
    ...transaction,
    // timestamp: new Date().toISOString(),
  });

  await tx.done;
  return id;
};


export const syncPendingTransactions = async (user_id) => {
  const db = await initDB();

  const readTx = db.transaction(STORE_NAME, "readonly");
  const readStore = readTx.objectStore(STORE_NAME);

  const all = await readStore.getAll();
  const pending = all.filter(t => t.status === "PENDING");

  await readTx.done;

  if (pending.length === 0) return;

  const formData = new FormData();

  pending.forEach((t, index) => {
    formData.append(`transactions[${index}].userId`, user_id);
    formData.append(`transactions[${index}].id`, t.id);
    formData.append(`transactions[${index}].indexId`, t.id);
    formData.append(`transactions[${index}].recipient`, t.recipient);
    formData.append(`transactions[${index}].amount`, t.amount);
    formData.append(`transactions[${index}].timestamp`, t.timestamp);

    if (t.qrImage) {
      formData.append(`transactions[${index}].qrImage`, t.qrImage);
    }
  });

  try {
    // ✅ 2. Call API OUTSIDE transaction
    const response = await fetch(`${API_URL}/api/payments/bulk`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Sync failed");
    }

    // ✅ 3. NEW transaction for update
    const writeTx = db.transaction(STORE_NAME, "readwrite");
    const writeStore = writeTx.objectStore(STORE_NAME);

    for (const t of pending) {
      t.status = "SYNCED";
      await writeStore.put(t);
    }

    await writeTx.done;

    console.log("Transactions synced successfully!");

  } catch (error) {
    console.error("Sync error:", error);
  }
};

export const loadPendingTransactions = async (user_id) => {
   const db = await initDB();
  try {
    const response = await fetch(
      `${API_URL}/api/payments/get-pending-payments?id=${user_id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Sync failed");
    }

    const pending = await response.json(); 

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    console.log(await store.getAll());
    

    for (const serverTx of pending) {
      // console.log(serverTx);
      
      // Check if transaction exists in IndexedDB
      const localTx = await store.get(serverTx.indexId);
      // console.log(localTx);
      

      if (localTx) {
        // console.log(serverTx);
        localTx.status = serverTx.status; // Update status
        await store.put(localTx);
      }else{
        // If not exists, add to IndexedDB
        await store.add({
      
          id: serverTx.indexId || null, // Use server's indexId as local id
          recipient: serverTx.recipient,
          amount: serverTx.amount,
          timestamp: serverTx.createdAt || null,
          status: serverTx.status,
          qrImage: serverTx.qrImage || null,
        });
      }
    }

    await tx.done;

    console.log("Transactions synced successfully!");
  } catch (error) {
    console.error("Sync error:", error);
  }
};





export const getAllTransactions = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getTransactionById = async (id) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const updateTransaction = async (id, updates) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const transaction = await store.get(id);

  if (transaction) {
    const updatedTransaction = { ...transaction, ...updates };
    await store.put(updatedTransaction);
  }

  await tx.done;
};

export const updateTransactionStatus = async (id, status) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const transaction = await store.get(id);

  if (transaction) {
    transaction.status = status;   
    await store.put(transaction);
  }

  await tx.done;
};


export const deleteTransaction = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getPendingTransactions = async () => {
  const db = await initDB();
  const index = db.transaction(STORE_NAME).objectStore(STORE_NAME).index('status');
  return index.getAll('PENDING');
};

export const clearAllTransactions = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};

export const deleteAllTransactions = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const allKeys = await store.getAllKeys();

  for (const key of allKeys) {
    await store.delete(key);
  }
}
