import * as nacl from  'tweetnacl-ts';
import { base_encode, base_decode } from './serialize';
import { Assignable } from './enums';

export type Arrayish = string;

export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}

/** All supported key types */
export enum KeyType {
    ED25519 = 0,
}

function key_type_to_str(keyType: KeyType): string {
    switch (keyType) {
    case KeyType.ED25519: return 'ed25519';
    default: throw new Error(`Unknown key type ${keyType}`);
    }
}

function str_to_key_type(keyType: string): KeyType {
    
    if(keyType.toLowerCase()== 'ed25519') return KeyType.ED25519;
    else throw new Error(`Unknown key type ${keyType}`);
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
 export class PublicKeyConfig {
    keyType: KeyType;
    data: Uint8Array;
 }
 export class PublicKey {
    keyType: KeyType;
    data: Uint8Array;

    constructor(config:PublicKeyConfig)
    {
        this.keyType=config.keyType;
        this.data=config.data;
    }

    static from(value: string ): PublicKey {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }

    static fromString(encodedKey: string): PublicKey {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            
            return new PublicKey({ keyType: KeyType.ED25519, data: base_decode(parts[0]) });

        } else if (parts.length === 2) {
            return new PublicKey({ keyType: str_to_key_type(parts[0]), data: base_decode(parts[1]) });
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString(): string {
        return `${key_type_to_str(this.keyType)}:${base_encode(<Uint8Array>this.data)}`;
    }
}

export abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): PublicKey;

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: string): KeyPair {
        switch (curve.toUpperCase()) {
        case 'ED25519': return KeyPairEd25519.fromRandom();
        default: throw new Error(`Unknown curve ${curve}`);
        }
    }

    static fromString(encodedKey: string): KeyPair {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        } else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
            case 'ED25519': return new KeyPairEd25519(parts[1]);
            default: throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairEd25519 extends KeyPair {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        super();
        const keyPair = nacl.sign_keyPair_fromSecretKey(base_decode(secretKey));
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: keyPair.publicKey });
        this.secretKey = secretKey;
    }

    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom():KeyPairEd25519 {
        const newKeyPair = nacl.sign_keyPair();
        return new KeyPairEd25519(base_encode(newKeyPair.secretKey));
    }

    sign(message: Uint8Array): Signature {
       
        const signature = nacl.sign_detached(message, base_decode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return nacl.sign_detached_verify(message, signature, <Uint8Array>this.publicKey.data);
    }

    toString(): string {
        return `ed25519:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}