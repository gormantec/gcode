/* Feature Name: Help Menu */

import { remove } from '/modules/near/index.mjs';

export const menuMetadata =  {"id":"removeNear","class":"pageLeftToolbarButton","materialIcon":"delete_forever"};

export function menuAction(){
    console.log("Help");
}