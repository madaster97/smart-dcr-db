import { DBSchema, openDB } from 'idb';

export type ClientData = {
    client_id: string,
    iss: string,
    creationTime: Date
}

interface ClientDB extends DBSchema {
    clients: {
        key: [string, string],
        value: ClientData,
        indexes: { 'by-iss': string }
    },
    keys: {
        key: 'public' | 'private',
        value: CryptoKey
    }
}

export async function getDB() {
    return openDB<ClientDB>('smart-dcr-db', 1, {
        upgrade: (db) => {
            const clientStore = db.createObjectStore('clients', { keyPath: ['client_id', 'iss'] });
            clientStore.createIndex('by-iss', 'iss', { unique: false });
            db.createObjectStore('keys');
        }
    })
}