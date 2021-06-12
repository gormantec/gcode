/* Feature Name: Help Menu */

import { remove } from '/modules/near/index.mjs';

export const menuMetadata =  {"id":"removeNear","class":"pageLeftToolbarButton","materialIcon":"delete_forever"};

export function menuAction(){
    var sourceCode=window.editor.getValue();
    var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
    var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
    remove({ accountId: accountId, contractId: contractId });
}