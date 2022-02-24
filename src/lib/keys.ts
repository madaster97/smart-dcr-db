import { getDB } from './database';

const RSANAME = 'RSASSA-PKCS1-v1_5'
const RSAPARAMS: RsaHashedKeyGenParams = {
    name: RSANAME,
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-384'
}
const ECNAME = 'ECDSA'
const ECPARAMS: EcKeyGenParams = {
    name: ECNAME,
    namedCurve: 'P-384'
}
type Result<T> = { success: true, output: T } | { success: false, message: string };
function getAlgFromKey(key: CryptoKey): Result<Alg> {
    switch (key.algorithm.name) {
        case ECNAME:
            return { success: true, output: 'ES384' }
        case RSANAME:
            return { success: true, output: 'RS384' }
        default:
            return { success: false, message: 'Unknown key algorithm found: ' + key.algorithm.name }
    }
}

type Alg = 'RS384' | 'ES384'
async function generateNewKeys(alg: Alg) {
    return crypto.subtle.generateKey(
        alg === 'ES384' ? ECPARAMS : RSAPARAMS
        , false, ['sign', 'verify']).then(({privateKey,publicKey}) => {
            if (!publicKey) {
                throw new Error('Could not generate public key')
            }
            if (!privateKey) {
                throw new Error('Could not generate private key')
            }
            return {publicKey, privateKey};
        });
}

function checkKeys(alg: Alg, keys: CryptoKey[]): Result<CryptoKeyPair> {
    // Things to check
    /**
     * 1. There are 2 keys
     * 2. One key is private, one is public
     * 3. Both keys have the same algorithm
     * 4. The algorithm matches the requested one 
     */
    if (keys.length !== 2) {
        return { success: false, message: 'Expected 2 keys, found ' + keys.length }
    }
    const [key1, key2] = keys;
    if (key1.type !== key2.type) {
        return { success: false, message: 'Expected 1 public and 1 private key. Found 2 ' + key1.type }
    }
    if (key1.type === 'secret' || key2.type === 'secret') {
        return { success: false, message: 'Encountered secret key(s) instead of a key pair' }
    }
    const key1AlgResult = getAlgFromKey(key1);
    const key2AlgResult = getAlgFromKey(key2);
    if (!(key1AlgResult.success && key2AlgResult.success)) {
        const messages = [];
        if (!key1AlgResult.success) { messages.push(key1AlgResult.message) }
        if (!key2AlgResult.success) { messages.push(key2AlgResult.message) }
        return { success: false, message: 'Could not retrieve algorithm from key set: ' + messages.join(';') }
    }
    const key1Alg = key1AlgResult.output;
    const key2Alg = key2AlgResult.output;
    if (key1Alg !== key2Alg) {
        return { success: false, message: `Key algorithms did not match. One was ${key1Alg} and the other ${key2Alg}` }
    }
    if (key1Alg !== alg) {
        return { success: false, message: `Existing keys had algorithm ${key1Alg}, which did not match requested ${alg}` }
    }
    return {
        success: true, output: {
            publicKey: key1.type === 'public' ? key1 : key2,
            privateKey: key1.type === 'private' ? key1 : key2
        }
    }
}

export async function getKeys(alg: Alg) {
    if (alg !== 'ES384' && alg !== 'RS384') {
        throw new Error(`Unsupported algorithm requesed (${alg}). Only ES384 and RS384 are supported`)
    }
    const db = await getDB();
    const tx = db.transaction('keys', 'readwrite');
    const keys = await tx.store.getAll();
    // If any of these fail, make new keys and flush the client list
    const keyCheck = checkKeys(alg, keys);
    if (keyCheck.success) {
        await tx.done;
        return keyCheck.output;
    } else {
        // TODO - log keyCheck.message;
        const newKeys = await generateNewKeys(alg);
        await tx.store.add(newKeys.privateKey, 'private');
        await tx.store.add(newKeys.publicKey, 'public');
        await tx.done;
        // TODO - PUT THE CLIENT FLUSH HERE!!!!!!
        return newKeys;
    }
}