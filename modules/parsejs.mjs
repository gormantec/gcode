var AnnotationBuilder = function(comments) {
    this.ignoredGlobalNamespaces = [
        'abstract', 'access', 'alias', 'augments', 'author', 'borrows',
        'callback', 'classdesc', 'constant', 'constructor', 'constructs',
        'copyright', 'default', 'deprecated', 'desc', 'enum', 'event',
        'example', 'exports', 'external', 'file', 'fires', 'global',
        'ignore', 'inner', 'instance', 'kind', 'lends', 'license',
        'link', 'member', 'memberof', 'method', 'mixes', 'mixin',
        'module', 'name', 'namespace', 'param', 'private', 'property',
        'protected', 'public', 'readonly', 'requires', 'returns', 'see',
        'since', 'static', 'summary', 'this', 'throws', 'todo', 'tutorial',
        'type', 'typedef', 'variation', 'version'
    ];

    this.comments = {
        "class": [],
        "methods": {},
        "properties": {},
        "other": []
    };

    this.commentArrayReference = this.comments.other;

    this.buildComments(comments);

    return this.comments;
}

AnnotationBuilder.prototype.buildComments = function(comments) {
    for (var i in comments) {
        var comment = comments[i];

        if (this.ignoredGlobalNamespaces.indexOf(comment.key) > -1) {
            continue;
        }

        if (comment.key == 'Class') {
            this.commentArrayReference = this.comments.class;
            continue;
        }

        if (comment.key == "Method") {
            this.createMethod(comment.value);
            continue;
        }

        if (comment.key == "Property") {
            this.createProperty(comment.value);
            continue;
        }

        this.commentArrayReference.push(comment);
    }
}

AnnotationBuilder.prototype.createMethod = function(name) {
    if (!this.comments.methods[name]) {
        this.comments.methods[name] = [];
    }

    this.commentArrayReference = this.comments.methods[name];
}

AnnotationBuilder.prototype.createProperty = function(name) {
    if (!this.comments.properties[name]) {
        this.comments.properties[name] = [];
    }

    this.commentArrayReference = this.comments.properties[name];
}

var AnnotationReader = function(comments) {
    this.comments = new AnnotationBuilder(comments);
}

AnnotationReader.prototype.getClassAnnotations = function() {
    return [].concat(this.comments.class);
}

AnnotationReader.prototype.getMethodAnnotations = function(name) {
    if (!this.comments.methods[name]) {
        throw new Error('The method ' + name + ' was not found between the comments');
    }

    return [].concat(this.comments.methods[name]);
}

AnnotationReader.prototype.getMethodNames = function() {
    if (!this.comments.methods) {
        throw new Error('No methods found between the comments');
    }

    return Object.keys(this.comments.methods);
}

var AnnotationParser = function() {

}

AnnotationParser.prototype.parse = function(dataString, callback) {
    var comments = this.matchComments(dataString);

    callback(comments);
}

AnnotationParser.prototype.matchComments = function(dataString) {
    var regex   = /\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/g;
    var matches = [];
    var match = false;
    while (match = this.getMatches(regex, dataString)) {
        if (match) {
            matches.push(match[0].replace(/(\*|[\r\n])/g, ''));
        }
    }

    var comments = this.parseComments(matches);

    return comments;
}

AnnotationParser.prototype.getMatches = function(regex, dataString) {
    var result = regex.exec(dataString);

    if (result) {
        return result;
    }

    return false;
}

AnnotationParser.prototype.parseComments = function(comments) {
    var commentList = [];

    for (var i in comments) {
        var subComments = comments[i].split(';');
        for (var j in subComments) {
            var regex = /@(.*)\((.*)\)/g;
            var match=false;
            while (match = this.getMatches(regex, subComments[j])) {
                if (match) {
                    var value = (match[2]) ? match[2] : false;

                    var obj = {
                        "key": match[1],
                        "value": JSON.parse(value)
                    };

                    commentList.push(obj);
                }
            }
        }
    }

    return commentList;
}



export function parsejs(data,callback)
{
    var annotationParser = new AnnotationParser();
    annotationParser.parse(data, function(comments) {

        var anAnnotationReader=new AnnotationReader(comments)
        console.log("comments");
        console.log(comments);

        var testdata = {
            accountId: "gormantec.testnet",
            contractId: "hello.gormantec.testnet",
            methods: []
          }
    
          try {
            var near = anAnnotationReader.getClassAnnotations("Near");
            if (near && near[0].value && near[0].value.accountId) testdata.accountId = near[0].value.accountId;
            if (near && near[0].value && near[0].value.contractId) testdata.contractId = near[0].value.contractId;
          } catch (e) { console.log(e); }
    
          
            var anot = null;
            var mKeys=anAnnotationReader.getMethodNames();
            for(var j=0;j<mKeys.length;j++)
            {
                var key=mKeys[j];
                try { anot = anAnnotationReader.getMethodAnnotations(key); } catch (e) { }
                var parameters = {};
                var name = "can" + key.toLowerCase;
                var result = "null";
                var type = key.substring(0, 3) == "set" ? "changeMethods" : "viewMethods";
                for (var i = 0; anot && i < anot.length; i++) {
                if (anot && anot[i].key == "testing" && anot[i].value) {
                    if (anot[i].value.test) parameters = anot[0].value.test;
                    if (anot[i].value.name) name = anot[0].value.name;
                    if (anot[i].value.result) result = anot[0].value.result;
                    if (anot[i].value.type && (anot[0].value.type=="changeMethod" || anot[0].value.type=="changeMethods")) type = "changeMethods";
                    else if (anot[i].value.type && (anot[0].value.type=="viewMethod" || anot[0].value.type=="viewMethods")) type = "viewMethods";
                }
                }
                if(anot!=null && key!=null && parameters!=null){
                testdata.methods.push({ name: name, method: key, type: type, parameters: parameters, result: result });
                }
            }
          


        callback(testdata);
    });
}