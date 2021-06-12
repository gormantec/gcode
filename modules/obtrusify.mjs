export function ob(s) {
    var a = Array.from(s);
    for (var i = 1; i < a.length; i = i + 2) {
        var a2 = a[i - 1];
        a.splice(i - 1, 1, a[i]);
        a.splice(i, 1, a2);
    }
    return a.join("");
}
export function dob(s) {
    var a = Array.from(s);
    for (var i = 1; i < a.length; i = i + 2) {
        var a2 = a[i];
        a.splice(i, 1, a[i - 1]);
        a.splice(i - 1, 1, a2);
    }
    return a.join("");
}