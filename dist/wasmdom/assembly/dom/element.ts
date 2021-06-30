import * as jsdom from "../wasmdom";
import {Style } from "./style";
import { Debug } from "wasmdom-globals";

//interface CallbackTwoParams<T1 = void, T2 = void,T3 = void> {(param1: T1,param2: T2): T3;}
class EventCallback {
    event:string;
    callback:()=>void
    constructor(event:string, func: () => void)
    {
        this.event=event;
        this.callback=func;
    }
}
class Callback {
    guid: i32;
    callback: () => void;

    constructor(func: () => void)
    {
        this.callback=func;

        var d:i32=(i32)(Date.now()/60000);
        var r:i32=(i32)(Math.random() * 2000000000);
        this.guid = d + r;

    }
}



/** @class In the HTML DOM, the Element object represents an HTML element, like P, DIV, A, TABLE, or any other HTML element. */
class Element{

pointer: i32;
eventListeners: EventCallback[];
_style: Style;
_name: string;

static _elements:Element[] = [];
   


/**
 * Creates an instance of Circle.
 *
 * @constructor
 * @author: gormantec
 * @param {string} name The tag name.
 * @param {i32} p The DOM pointer, if it exists, otherwise create one.
 */
constructor(name:string,p:i32 = -1) {
    this._name=name;
    this.eventListeners=[];
    if(p>=0) this.pointer=p;
    else this.pointer=jsdom.createElement(name);
    this._style=new Style(this.pointer);
    Element._elements.push(this);
    var s:string = jsdom.nodeName(this.pointer);
}


static _findElementByPointer(p:i32):Element|null
{
    Debug.log("[findElementByPointer:start] p="+p.toString()+" count="+this._elements.length.toString());
    var result:Element|null=null;  
    if(this._elements!=null && this._elements.length>0)
    {
        for(var i=0;i<this._elements.length && result==null;i++)
        {
            if(this._elements[i].pointer==p){result=this._elements[i];};
        }
    }
    var r:string = (result!=null)?(<Element>result).toString():"";
    Debug.log("[findElementByPointer:end] "+r);
    return result;
}

static fromPointer(p:i32):Element
{
    Debug.log("[Element:fromPointer] "+p.toString());
    var e1:Element|null = Element._findElementByPointer(p);
    if(e1){
        var e2:Element =e1;
        return e2;
    }
    else{
        if(p<=0){
            return new Element("HTML");
        }
        var s:string=jsdom.nodeName(p);
        var e3:Element = new Element(s,p);
        return e3;
    }
}

public get content():Element{
    if(this.nodeName.toLowerCase()!="template")
    {
        throw new Error("content only avaliable on HTMLTemplateElement");
    }
    return Element.fromPointer(jsdom.templateContent(this.pointer));
}

public alertEventListener(event:string):void
{
    for(var i=0;i<this.eventListeners.length;i++)
    {
        if(this.eventListeners[i].event==event){
            this.eventListeners[i].callback();
        }
    };
}


public set src(url:string){this.setAttribute("src",url);};


/**
 * Sets or returns the accesskey attribute of an element
 */
public get accessKey():string{return jsdom.getAccessKey(this.pointer).toString();}
public set accessKey(key:string){jsdom.setAccessKey(this.pointer,key);}

/**
 * Attaches an event handler to the specified element
 */
public addEventListener(listener:EventCallback):void{
    jsdom.addEventListener(this.pointer,listener.event);
    this.eventListeners.push(listener);
}

public set onclick(callback:()=>void){this.addEventListener(new EventCallback("click",callback));}

/**
 * Adds a new child node, to an element, as the last child node
 */
public appendChild(child:Element):void{ jsdom.appendChild(this.pointer,child.pointer); }
	
/**
 * Returns a NamedNodeMap of an element's attributes
 */
public get attributes():string[] {return []};

/**
 * Removes focus from an element
 */
public blur():void{}

/**
 * Returns the number of child elements an element has
 */
public childElementCount():i32 {return 0;}

/**
 * Returns a collection of an element's child nodes (including text and comment nodes)
 */
public get childNodes():Element[]{
    Debug.log("childNodes");
    return this.children;
}

	
/**
 * Returns a collection of an element's child element (excluding text and comment nodes)
 */
public get children():Array<Element>{
    
    var rs:Int32Array = jsdom.children(this.pointer);
    var e:Array<Element> = [];
    if(rs && rs.length>0){
        for(var i:i32=0;i<rs.length;i++)
        {
            e.push(Element.fromPointer(rs[i]));
        }
    }
    return e;

}

/**
 * Returns the class name(s) of an element
 */
//classList	

/**
 * Sets or returns the value of the class attribute of an element
 */
public get className():string|null
{
    return jsdom.getAttribute(this.pointer,"class").toString();
}
public set className(s:string|null)
{
    if(s)jsdom.setAttribute(this.pointer,"class",s);
    else jsdom.setAttribute(this.pointer,"class","");
}

/**
 * Simulates a mouse-click on an element
 */
//click()	

/**
 * Returns the height of an element, including padding
 */
//clientHeight	

//clientLeft	
/**
 * Returns the width of the left border of an element
 */
//clientTop	
/**
 * Returns the width of the top border of an element
 */
//clientWidth	
/**
 * Returns the width of an element, including padding
 */
//cloneNode()	
/**
 * Clones an element
 */
///closest()	
/**
 * Searches up the DOM tree for the closest element which matches a specified CSS selector
 */
//compareDocumentPosition()	
/**
 * Compares the document position of two elements
 */
//contains()
/**
 * 	Returns true if a node is a descendant of a node, otherwise false
 */
//contentEditable	
/**
 * Sets or returns whether the content of an element is editable or not
 */
//dir	
/**
 * Sets or returns the value of the dir attribute of an element
 */
//exitFullscreen()	
/**
 * Cancels an element in fullscreen mode
 */

/**
 * Returns the first child node of an element
 */
public get firstChild():Element|null{
    Debug.log("[firstChild:start]");
    var rs:Int32Array = jsdom.children(this.pointer);
    if(rs.length<1){
        return null;
    }
    else{
        var ee:Element=Element.fromPointer(rs[0]);
        return ee;
    } 
}

//firstElementChild	
/**
 * Returns the first child element of an element
 */
//focus()	
/**
 * Gives focus to an element
 */

 	
/**
 * Returns the specified attribute value of an element node
 */
public getAttribute(name:string):string|null
{
    var a = jsdom.getAttribute(this.pointer,name);
    if(a=="[#WASMDOM:null]")return null;
    else return a;
}

//getAttributeNode()	
/**
 * Returns the specified attribute node
 */
//getBoundingClientRect()	
/**
 * Returns the size of an element and its position relative to the viewport
 */
//getElementsByClassName()	
/**
 * Returns a collection of all child elements with the specified class name
 */
//getElementsByTagName()	
/**
 * Returns a collection of all child elements with the specified tag name
 */
//hasAttribute()	
/**
 * Returns true if an element has the specified attribute, otherwise false
 */
///hasAttributes()	
/**
 * Returns true if an element has any attributes, otherwise false
 */
//hasChildNodes()	
/**
 * Returns true if an element has any child nodes, otherwise false
 */


/**
 * Sets or returns the value of the id attribute of an element
 */
public get id():string|null{return jsdom.getAttribute(this.pointer,"id");}
public set id(id:string|null){
    if(id)jsdom.setAttribute(this.pointer,"id",id);
    else jsdom.setAttribute(this.pointer,"id","");
}
	
/**
 * Sets or returns the content of an element
 */
public get innerHTML():string{return jsdom.getInnerHTML(this.pointer).toString();}
public set innerHTML(html:string){jsdom.setInnerHTML(this.pointer,html)};

	
/**
 * Sets or returns the text content of a node and its descendants
 */
public get innerText():string{return jsdom.getInnerText(this.pointer).toString();}
public set innerText(text:string){jsdom.setInnerText(this.pointer,text)};

//insertAdjacentElement()	
/**
 * Inserts a HTML element at the specified position relative to the current element
 */
//insertAdjacentHTML()	
/**
 * Inserts a HTML formatted text at the specified position relative to the current element
 */
//insertAdjacentText()	
/**
 * Inserts text into the specified position relative to the current element
 */

/**
 * Inserts a new child node before a specified, existing, child node
 */
public insertBefore( newnode:Element,existingnode:Element|null):void
{
    Debug.log("[insertBefore:start]");
    if(existingnode){
        jsdom.insertBefore(this.pointer,newnode.pointer,existingnode.pointer);
    }
    else{
        jsdom.appendChild(this.pointer,newnode.pointer);
    }
}

///isContentEditable	
/**
 * Returns true if the content of an element is editable, otherwise false
 */
//isDefaultNamespace()	
/**
 * Returns true if a specified namespaceURI is the default, otherwise false
 */
//isEqualNode()	
/**
 * Checks if two elements are equal
 */
//isSameNode()	
/**
 * Checks if two elements are the same node
 */
//isSupported()	
/**
 * Returns true if a specified feature is supported on the element
 */
//lang	
/**
 * Sets or returns the value of the lang attribute of an element
 */

/**
 * Returns the last child node of an element
 */
public get lastChild():Element|null{return this.children.length>0?this.children[this.children.length-1]:null};	


//lastElementChild	
/**
 * Returns the last child element of an element
 */
//matches()	
/**
 * Returns a Boolean value indicating whether an element is matched by a specific CSS selector or not
 */
//namespaceURI	
/**
 * Returns the namespace URI of an element
 */
//nextSibling	
/**
 * Returns the next node at the same node tree level
 */
//nextElementSibling	
/**
 * Returns the next element at the same node tree level
 */
	
/**
 * Returns the name of a node
 */
public get nodeName():string{
    var s:string = jsdom.nodeName(this.pointer).toString();
    return s;
    }

//nodeType	
/**
 * Returns the node type of a node
 */
//nodeValue	
/**
 * Sets or returns the value of a node
 */
//normalize()	
/**
 * Joins adjacent text nodes and removes empty text nodes in an element
 */
//offsetHeight	
/**
 * Returns the height of an element, including padding, border and scrollbar
 */
//offsetWidth	
/**
 * Returns the width of an element, including padding, border and scrollbar
 */
//offsetLeft	
/**
 * Returns the horizontal offset position of an element
 */
//offsetParent	
/**
 * Returns the offset container of an element
 */
//offsetTop	
/**
 * Returns the vertical offset position of an element
 */
//outerHTML	
/**
 * Sets or returns the content of an element (including the start tag and the end tag)
 */
//outerText	
/**
 * Sets or returns the outer text content of a node and its descendants
 */
//ownerDocument	
/**
 * Returns the root element (document object) for an element
 */
//parentNode	
/**
 * Returns the parent node of an element
 */
//parentElement	
/**
 * Returns the parent element node of an element
 */
//previousSibling	
/**
 * Returns the previous node at the same node tree level
 */
//previousElementSibling	
/**
 * Returns the previous element at the same node tree level
 */

 /**
 * Returns the first child element that matches a specified CSS selector(s) of an element
 */
 public querySelector(q:string):Element|null{
    var p:i32=jsdom.querySelector(this.pointer,q);
    if(p>=0)return Element.fromPointer(p);
    else return null;
 }

/**
 * Returns all child elements that matches a specified CSS selector(s) of an element
 */
public querySelectorAll(q:string):Element[]{
    Debug.log("[Element::querySelectorAll] start");
    var rs:Int32Array = jsdom.querySelectorAll(this.pointer,q);
    var e:Element[] = [];
    var e:Array<Element> = [];
    if(rs && rs.length>0){
        for(var i:i32=0;i<rs.length;i++)
        {
            e.push(Element.fromPointer(rs[i]));
        }
    }
    Debug.log("[Element::querySelectorAll] end");
    return e;
}

/**
 * Removes the element from the DOM
 */
 public remove():void{jsdom.remove(this.pointer);}


//removeAttribute()	
/**
 * Removes a specified attribute from an element
 */
//removeAttributeNode()	
/**
 * Removes a specified attribute node, and returns the removed node
 */
/**
 * Removes a child node from an element
 */
public removeChild(child:Element|null):void
{
    if(child)jsdom.removeChild(this.pointer,child.pointer);
    /* TBC */
}


//removeEventListener()	
/**
 * Removes an event handler that has been attached with the addEventListener() method
 */
//replaceChild()	
/**
 * Replaces a child node in an element
 */
//requestFullscreen()	
/**
 * Shows an element in fullscreen mode
 */
//scrollHeight	
/**
 * Returns the entire height of an element, including padding
 */
//scrollIntoView()	
/**
 * Scrolls the specified element into the visible area of the browser window
 */
//scrollLeft	
/**
 * Sets or returns the number of pixels an element's content is scrolled horizontally
 */
//scrollTop	
/**
 * Sets or returns the number of pixels an element's content is scrolled vertically
 */
//scrollWidth	
/**
 * Returns the entire width of an element, including padding
 */


/**
 * Sets or changes the specified attribute, to the specified value
 */
public setAttribute(name:string, value:string):void
{
    jsdom.setAttribute(this.pointer,name,value);
}

//setAttributeNode()	
/**
 * Sets or changes the specified attribute node
 */

/**
 * Sets or returns the value of the style attribute of an element
 */
public get style():Style{return this._style;}

public set style(s:Style){ this._style=s;}

//tabIndex	
/**
 * Sets or returns the value of the tabindex attribute of an element
 */
//tagName	
/**
 * Returns the tag name of an element
 */
//textContent	
/**
 * Sets or returns the textual content of a node and its descendants
 */
//title	
/**
 * Sets or returns the value of the title attribute of an element
 */
/**
 * Converts an element to a string
 */
 public toString():string{return '[Element:{name:"'+this._name+'",nodeName:"'+this.nodeName+'",pointer:'+this.pointer.toString()+'}]'}	

}

export { Element,Callback,EventCallback };