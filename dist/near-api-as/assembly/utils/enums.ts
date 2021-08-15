import { Action} from '../transaction';
import { PublicKey} from './key_pair';

import {i256Safe as BN } from "as-bignum";
import { SchemaSerializable } from 'borsh-as';





/** @hidden @module */
export abstract class Enum extends SchemaSerializable {
    enum: string;

    constructor(properties: string) {
        super();
        this.enum=properties;
        /*
            if (Object.keys(properties).length !== 1) {
                throw new Error('Enum can only take single value');
            }
            Object.keys(properties).map((key: string) => {
                (this as any)[key] = properties[key];
                this.enum = key;
            });
            */
    }
}
class AssignableConfig{name:string;value:string|null};

export abstract class Assignable {
    constructor(properties: AssignableConfig[]) {
        /*
        Object.keys(properties).map((key: any) => {
            (this as any)[key] = properties[key];
        });
        */
    }
}