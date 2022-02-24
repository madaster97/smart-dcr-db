# smart-dcr-db
A database for storing dynamic clients in a browser.

**IN-PROGRESS!*

## IndexedDB
This library uses IndexedDB (through the [idb](https://www.npmjs.com/package/idb) library) to store the following data:
- A single public/private key pair (Either RS384 or ES384)
- Your set of `client_id`s, keyed by the FHIR issuer endpoint (`iss`) they were issued for

## Authentication Keys
This library creates an asymmetric key pair (Either RS384 or ES384) and stores the keys as SubtleCrypto [`CryptoKey`s](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey).

The public key is extractable, but the private key is not. The library/function you use to sign assertions with this private key must support `CrpytoKey`s natively.

[jose](https://www.npmjs.com/package/jose) version 5, for example, supports signing assertions like this:
```js
// TODO
```

## Client Database
This library provides a database to store dynamically registered `client_id`s. The following operations will be available:
- Storing a new client_id/iss pair. This library also stores the time the client was stored, and (**FUTURE**) other key-value pairs you specify 
- Retrieving all clients for a given iss
- Deleting a given client OR all clients for an iss

## Future
I'd like to integrate this library with [fhirclient](https://github.com/smart-on-fhir/client-js) library. For now I'm working on the core APIs for retrieving/setting keys and clients.

Ultimately, I'd like to use this as a springboard for standardizing [Offline Access for Native and Browser-Based Applications](https://fhir.epic.com/Documentation?docId=oauth2&section=Standalone-Oauth2-OfflineAccess-0)
