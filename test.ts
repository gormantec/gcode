import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'NA'

/** 
 * @Method("setGreeting");
 * @testing({"name":"can set greeting","test":{"message":"hello"},"result":"null"});
*/
export function setKey(key: string,email:string): void {
  const account_id = Context.sender
  storage.set(cyrb53(account_id+"-"+email), key)
}

/** 
 * @Method("getGreeting");
 * @testing({"name":"can get greeting","test":{"accountId":"@Near.accountId"},"result":"hello"});
*/
export function getKey(accountId: string,email:string): string | null {
  return storage.get<string>(cyrb53(accountId+"-"+email), DEFAULT_MESSAGE)
}

function cyrb53(str:string, seed:i32 = 0): i32 {
    let h1:i32 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i:i32 = 0, ch:i32; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};