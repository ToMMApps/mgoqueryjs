/**
 * Entry point for the mgoqueryjs parser.
 * Please use this entry point instead of using the generated parser directly!
 * The whitespaces of the input string must be removed before it can be parsed with the generated file.
 * Author: Henning Gerrits
 */

module.exports = function(config){
    var _parser = require("./grammar");
    var _DELIMITER = "'";

    /**
     * Returns the given string without any whitespaces.
     * The overhanded string will not be changed.
     */
    function _removeWhitespaces(str){
        return str.replace(/\s/g, '');
    }

    /**
     * Does only remove whitespaces that are not between delimiters.
     * Makes it possible to keep whitespaces inside of values.
     * The overhanded string will not be changed.
     */
    function _removeWhitespacesExceptForDelimiter(str){
        var splittedStr = str.split(_DELIMITER);
        var result = "";

        for(i = 0; i < splittedStr.length; i++){
            if(i % 2 == 0){
                result = result + _removeWhitespaces(splittedStr[i]);
            } else{
                result = result + "'" + splittedStr[i] + "'";
            }
        }

        return result;
    }

    /**
     * Parses the input string und calls the overhanded function with the resulting string.
     */
    this.parse = function(str, cb){
        var trimmed;

        if(config && config.removeAllWhitespaces){
            trimmed = _removeWhitespaces(str);
        } else{
            trimmed = _removeWhitespacesExceptForDelimiter(str);
        }

        var parsedStr = _parser.parse(trimmed);
        if(cb){cb(parsedStr);}
    };
};