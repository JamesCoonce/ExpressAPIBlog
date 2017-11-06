var assert = require("assert");
var bulkReplace = require("./bulk-replace");

var test = {
    "a": "A",
    "b": "B",
    "c": "C"
};

var str = "abcABC";
var expected = str.toUpperCase();

assert.equal(bulkReplace(str, test), expected);
assert.equal(bulkReplace(str, /a|b|c/ig, test), expected);

console.log("OK");
