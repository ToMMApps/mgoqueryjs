/**
* This grammar was designed to be compatible with the "mgoquery" project on bitbucket (https://bitbucket.org/elarson/mgoquery).
* It can be translated into an JavaScript file by using pegjs (https://github.com/pegjs/pegjs).
* Please use the provided entry point instead of using the generated parser directly!
* The whitespaces of the input string must be removed before it can be parsed with the generated file.
* Author: Henning Gerrits
* Created on: 17.02.2015
*/


/**
* Input strings can either consist of an single expressionList or multiple groups.
*/
start
	= exp:expressionList? g:groupList? {
	    if(exp){
	        return exp;
	    } else {
	        return g;
	    }
	}

groupBegin = [(]
groupEnd = [)]
andOr = [| ,]
operator = [= < >]

/**
* The provided logic prevents the parser to put extra commas into the resulting string.
* This is necessary for field and value.
*/
field
	= left:[a-z A-Z _ -] right:field? {
	    if(right){
	        return left + right;
	    } else return left;
	}
	
value
	= left:[a-z A-Z 0-9 _ -] right:value? {
	    if(right){
	        return left + right;
	    } else return left;
	}

/**
* An expression must always contain a field/key, an operator(:, < or >) and an associated value.
* Example: "x:1"
*/
expression
	= f:field op:operator v:value {
	    switch(op){
	        case "=":
	            return "{'" + f + "'" + ": " + "'" + v + "'}";
	        case "<":
	            return "{'" + f + "': {'$lte': '" + v + "'}}";
	        case ">":
            	return "{'" + f + "': {'$gte': '" + v + "'}}";
            default:
                throw err;
	    }
	}

/**
* Expressions can be combined by using either "|" or ",". The result is an expressionList.
* The operator and other expressions are optional(?) because of the possibility that the
* input string consists of only one expression. In this case the default action is to return the left expression.
* Example: "x:1 , y:2"
*/
expressionList
    = left:expression op:andOr ? right:otherExpressions ?{
        switch(op){
            case "|":
                return "{'$or': [" + left + ", " + right + "]}";
            case ",":
                return "{'$and': [" + left + ", " + right + "]}";
            default:
                return left;
        }
    }

/**
* Recursively defines how to handle extra expressions.
*/
otherExpressions
    = exp:expression op:andOr ? other:otherExpressions ? {
        if(other){
            return exp + ", " + other;
        } else return exp;

    }

group
    = groupBegin expList:expressionList groupEnd {
        return expList;
    }

/**
* Groups make it possible to use multiple combination operators.
* By defining groups you implicitly define the order in which your operators are handled.
* Example: (x:1 , y:2) , (z:3)
*/
groupList
    = left:group op:andOr? right:otherGroups?{
        switch(op){
            case "|":
                return "{'$or': [" + left + ", " + right + "]}";
            case ",":
                return "{'$and': [" + left + ", " + right + "]}";
            default:
                return left;
        }
    }

/**
* Recursively defines how to handle extra groups.
*/
otherGroups
    = g:group op:andOr? other:otherGroups? {
        if(other){
            return g + ", " + other;
        } else return g;
    }


