/**
 * @Class();
 * @Near({"accountId":"gormantec.testnet", "contractId": "hello.gormantec.testnet"});
 */

import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Hello'

/** 
 * @Method("getGreeting");
 * @testing({"name":"can get greeting","test":{"accountId":"accountId"},"result":"hello"});
*/
export function getGreeting(accountId: string): string | null {
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}


/** 
 * @Method("setGreeting");
 * @testing({"name":"can set greeting","test":{"message":"hello"},"result":"null"});
*/
export function setGreeting(message: string): void {
  const account_id = Context.sender
  logging.log( 'Saving greeting "' + message + '" for account "' + account_id + '"')
  storage.set(account_id, message)
}