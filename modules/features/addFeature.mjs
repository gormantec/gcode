/* Feature Name: Add Feature */

export function menuMetadata(){

    return {"id":"addFeatureButton","class":"pageLeftToolbarButton","materialIcon":"add_circle_outline"};

}

export function menuAction(){
    return function(){
        prompt("Add feature: "); ;
    };
}