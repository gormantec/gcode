/**
 * @Class();
 * @Near({"accountId":"gcode-0000000000000000.testnet", "contractId": "gcode-0000000000000000.testnet"});
 */

import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Hello'

/** 
 * @Method("setGreeting");
 * @testing({"name":"can set greeting","test":{"message":"hello"},"result":"null"});
*/
export function setGreeting(message: string): void {
  const account_id = Context.sender
  logging.log( 'Saving greeting "' + message + '" for account "' + account_id + '"')
  storage.set(account_id, message)
}

/** 
 * @Method("getGreeting");
 * @testing({"name":"can get greeting","test":{"accountId":"@Near.accountId"},"result":"hello"});
*/
export function getGreeting(accountId: string): string | null {
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}


