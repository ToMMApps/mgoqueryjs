/**
 * Entry point for the mgoqueryjs parser.
 * Please use this entry point instead of using the generated parser directly!
 * The whitespaces of the input string must be removed before it can be parsed with the generated file.
 * Author: Henning Gerrits
 */

module.exports = function(){
    var _parser = require("./grammar");

    function _removeWhitespaces(str){
        return str.replace(/\s/g, '');
    }

    this.parse = function(str, cb){
        var trimmed = _removeWhitespaces(str);
        var parsedStr = _parser.parse(trimmed);
        if(cb){cb(parsedStr);}
    };
};