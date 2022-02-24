import { getDB } from './database';

function getPrimaryKey(client_id: string, iss: string): [string, string] {
    return [client_id, iss]
}

function parsePrimaryKey([client_id, iss]: string[]) {
    return { client_id, iss }
}

// Promise <void>
export async function addClient
    (client_id: string, iss: string) {
    const db = await getDB();
    return db.add('clients', {
        client_id,
        iss,
        creationTime: new Date()
    }).then(parsePrimaryKey);
}

// Promise <ClientData>
export async function getClient
    (client_id: string, iss: string) {
    const db = await getDB();
    return db.get('clients', getPrimaryKey(client_id, iss))
}

// Promise<void>
export async function deleteClient
    (client_id: string, iss: string) {
    const db = await getDB();
    return db.delete('clients', getPrimaryKey(client_id, iss));
}

// Promise<string[]>
export async function getAllIss() {
    const db = await getDB();
    // TODO
    return ['test-iss']
    // const tx = db.transaction('clients', 'readonly');
    // const cursor = tx.store.index('by-iss')
    // // return db.transaction('clients','readonly').store.index('by-iss')
}

// Promise<ClientData[]>
export async function getClientsForIss(iss: string) {
    const db = await getDB();
    return db.getAllFromIndex('clients', 'by-iss', iss)
}

// Promise<void>
export async function deleteClientsForIss(iss: string) {
    const db = await getDB();
    const tx = db.transaction('clients', 'readwrite');
    const cursor = await tx.store.index('by-iss')
        .openKeyCursor(iss);
    while (cursor) {
        await tx.store.delete(cursor.primaryKey)
        cursor.continue()
    }
    await tx.done;
}