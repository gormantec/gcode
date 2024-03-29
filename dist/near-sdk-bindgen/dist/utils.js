"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSnakeCase = exports.toString = exports.posixRelativePath = exports.SimpleParser = void 0;
//@ts-ignore
let path = require("path");
const as_1 = require("visitor-as/as");
class SimpleParser {
    static getTokenizer(s) {
        return new as_1.Tokenizer(new as_1.Source(as_1.SourceKind.USER, "index.ts", s));
    }
    static parseExpression(s) {
        let res = this.parser.parseExpression(this.getTokenizer(s));
        if (res == null) {
            throw new Error("Failed to parse the expression: '" + s + "'");
        }
        return res;
    }
    static parseStatement(s, topLevel = false) {
        let res = this.parser.parseStatement(this.getTokenizer(s), topLevel);
        if (res == null) {
            throw new Error("Failed to parse the expression: '" + s + "'");
        }
        return res;
    }
    static parseTopLevel(s) {
        let tn = this.getTokenizer(s);
        let statements = [];
        while (!tn.skip(as_1.Token.ENDOFFILE)) {
            let statement = this.parser.parseTopLevelStatement(tn);
            if (statement) {
                statements.push(statement);
            }
            else {
                this.parser.skipStatement(tn);
            }
        }
        return statements;
    }
    static parseMethodDeclaration(s, parent) {
        let tn = this.getTokenizer(s);
        let res = this.parser.parseClassMember(tn, parent);
        if (res == null) {
            throw new Error("Failed to parse class member: '" + s + "'");
        }
        if (!(res instanceof as_1.MethodDeclaration)) {
            throw new Error("'" + s + "' is not a method declaration");
        }
        return res;
    }
}
exports.SimpleParser = SimpleParser;
SimpleParser.parser = new as_1.Parser();
function posixRelativePath(from, to) {
    const relativePath = path.relative(from, to);
    return relativePath.split(path.sep).join(path.posix.sep);
}
exports.posixRelativePath = posixRelativePath;
function toString(node) {
    return as_1.ASTBuilder.build(node);
}
exports.toString = toString;
const capitalPattern = /([a-z])([A-Z])/g;
const doubleCapital = /([A-Z])([A-Z][a-z])/g;
function makeSnakeCase(s) {
    return s.replace(capitalPattern, "$1_$2").replace(doubleCapital, "$1_$2").toLowerCase();
}
exports.makeSnakeCase = makeSnakeCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsWUFBWTtBQUNaLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUzQixzQ0FZdUI7QUFFdkIsTUFBYSxZQUFZO0lBR2YsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFTO1FBQ25DLE9BQU8sSUFBSSxjQUFTLENBQUMsSUFBSSxXQUFNLENBQUMsZUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFTO1FBQzlCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNoRTtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBUyxFQUFFLFdBQW9CLEtBQUs7UUFDeEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNoRTtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBUztRQUM1QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksVUFBVSxHQUFnQixFQUFFLENBQUM7UUFDakMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkQsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMvQjtTQUNGO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxzQkFBc0IsQ0FDM0IsQ0FBUyxFQUNULE1BQXdCO1FBRXhCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDOUQ7UUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLFlBQVksc0JBQWlCLENBQUMsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztTQUM1RDtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQzs7QUFsREgsb0NBbURDO0FBbERnQixtQkFBTSxHQUFHLElBQUksV0FBTSxFQUFFLENBQUM7QUFvRHZDLFNBQWdCLGlCQUFpQixDQUFDLElBQVksRUFBRSxFQUFVO0lBQ3hELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUhELDhDQUdDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLElBQVU7SUFDakMsT0FBTyxlQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDO0FBQ3pDLE1BQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDO0FBRTdDLFNBQWdCLGFBQWEsQ0FBQyxDQUFTO0lBQ3JDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMxRixDQUFDO0FBRkQsc0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL0B0cy1pZ25vcmVcbmxldCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmltcG9ydCB7XG4gIFRva2VuLFxuICBFeHByZXNzaW9uLFxuICBUb2tlbml6ZXIsXG4gIFBhcnNlcixcbiAgU291cmNlLFxuICBTb3VyY2VLaW5kLFxuICBTdGF0ZW1lbnQsXG4gIEFTVEJ1aWxkZXIsXG4gIE5vZGUsXG4gIE1ldGhvZERlY2xhcmF0aW9uLFxuICBDbGFzc0RlY2xhcmF0aW9uLFxufSBmcm9tIFwidmlzaXRvci1hcy9hc1wiO1xuXG5leHBvcnQgY2xhc3MgU2ltcGxlUGFyc2VyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHByaXZhdGUgc3RhdGljIGdldFRva2VuaXplcihzOiBzdHJpbmcpOiBUb2tlbml6ZXIge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKG5ldyBTb3VyY2UoU291cmNlS2luZC5VU0VSLCBcImluZGV4LnRzXCIsIHMpKTtcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUV4cHJlc3Npb24oczogc3RyaW5nKTogRXhwcmVzc2lvbiB7XG4gICAgbGV0IHJlcyA9IHRoaXMucGFyc2VyLnBhcnNlRXhwcmVzc2lvbih0aGlzLmdldFRva2VuaXplcihzKSk7XG4gICAgaWYgKHJlcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgdGhlIGV4cHJlc3Npb246ICdcIiArIHMgKyBcIidcIik7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VTdGF0ZW1lbnQoczogc3RyaW5nLCB0b3BMZXZlbDogYm9vbGVhbiA9IGZhbHNlKTogU3RhdGVtZW50IHtcbiAgICBsZXQgcmVzID0gdGhpcy5wYXJzZXIucGFyc2VTdGF0ZW1lbnQodGhpcy5nZXRUb2tlbml6ZXIocyksIHRvcExldmVsKTtcbiAgICBpZiAocmVzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBwYXJzZSB0aGUgZXhwcmVzc2lvbjogJ1wiICsgcyArIFwiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZVRvcExldmVsKHM6IHN0cmluZyk6IFN0YXRlbWVudFtdIHtcbiAgICBsZXQgdG4gPSB0aGlzLmdldFRva2VuaXplcihzKTtcbiAgICBsZXQgc3RhdGVtZW50czogU3RhdGVtZW50W10gPSBbXTtcbiAgICB3aGlsZSAoIXRuLnNraXAoVG9rZW4uRU5ET0ZGSUxFKSkge1xuICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMucGFyc2VyLnBhcnNlVG9wTGV2ZWxTdGF0ZW1lbnQodG4pO1xuICAgICAgaWYgKHN0YXRlbWVudCkge1xuICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFyc2VyLnNraXBTdGF0ZW1lbnQodG4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZU1ldGhvZERlY2xhcmF0aW9uKFxuICAgIHM6IHN0cmluZyxcbiAgICBwYXJlbnQ6IENsYXNzRGVjbGFyYXRpb25cbiAgKTogTWV0aG9kRGVjbGFyYXRpb24ge1xuICAgIGxldCB0biA9IHRoaXMuZ2V0VG9rZW5pemVyKHMpO1xuICAgIGxldCByZXMgPSB0aGlzLnBhcnNlci5wYXJzZUNsYXNzTWVtYmVyKHRuLCBwYXJlbnQpO1xuICAgIGlmIChyZXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIGNsYXNzIG1lbWJlcjogJ1wiICsgcyArIFwiJ1wiKTtcbiAgICB9XG4gICAgaWYgKCEocmVzIGluc3RhbmNlb2YgTWV0aG9kRGVjbGFyYXRpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCInXCIgKyBzICsgXCInIGlzIG5vdCBhIG1ldGhvZCBkZWNsYXJhdGlvblwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9zaXhSZWxhdGl2ZVBhdGgoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZShmcm9tLCB0byk7XG4gIHJldHVybiByZWxhdGl2ZVBhdGguc3BsaXQocGF0aC5zZXApLmpvaW4ocGF0aC5wb3NpeC5zZXApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TdHJpbmcobm9kZTogTm9kZSk6IHN0cmluZyB7XG4gIHJldHVybiBBU1RCdWlsZGVyLmJ1aWxkKG5vZGUpO1xufVxuXG5jb25zdCBjYXBpdGFsUGF0dGVybiA9IC8oW2Etel0pKFtBLVpdKS9nO1xuY29uc3QgZG91YmxlQ2FwaXRhbCA9IC8oW0EtWl0pKFtBLVpdW2Etel0pL2c7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlU25ha2VDYXNlKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoY2FwaXRhbFBhdHRlcm4sIFwiJDFfJDJcIikucmVwbGFjZShkb3VibGVDYXBpdGFsLCBcIiQxXyQyXCIpLnRvTG93ZXJDYXNlKCk7XG59XG4iXX0=