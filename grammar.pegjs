/**
* This grammar can be translated into an JavaScript file by using pegjs (https://github.com/pegjs/pegjs).
* Please use the provided entry point instead of using the generated parser directly!
* The whitespaces of the input string must be removed before it can be parsed with the generated file.
* Author: Henning Gerrits
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
operator = [= < > ^]
delimiter = [']

/**
* The provided logic prevents the parser to put extra commas into the resulting string.
* This is necessary for field and value.
* Because of the fact that field is not separated by apostrophes it is not allowed to contain any known symbols.
*/
field
    = left:[^(,|<>="^"] right:field? {
      	    if(right){
      	        return left + right;
      	    } else return left;
      	}

// The string in value can hold any characters except for a delimiter.
valueStr
    = left:[^'] right:valueStr? {
      	    if(right){
      	        return left + right;
      	    } else return left;
      	}

value = delimiter str:valueStr delimiter {return str;}


// An expression must always contain a field/key, an operator and an associated value.
expression
	= f:field op:operator v:value {
	    switch(op){
	        case "=":
	            return "{'" + f + "'" + ": " + "'" + v + "'}";
	        case "<":
	            return "{'" + f + "': {'$lte': '" + v + "'}}";
	        case ">":
            	return "{'" + f + "': {'$gte': '" + v + "'}}";
            case "^":
                return "{'" + f + "': {'$regex': '" + v + "'}}";
            default:
                throw "Unknown error occurred while parsing " + "'" + text() + "'";
	    }
	}

/**
* Expressions can be combined by using either "|" or ",". The result is an expressionList.
* The operator and other expressions are optional(?) because of the possibility that the
* input string consists of only one expression. In this case the default action is to return the left expression.
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

// Recursively defines how to handle additional expressions.
otherExpressions
    = exp:expression op:andOr ? other:otherExpressions ? {
        if(other){
            return exp + ", " + other;
        } else return exp;

    }

// A group can either hold another groupList or an expressionList.
group
    = groupBegin expList:expressionList? gList:groupList? groupEnd {
        if(expList){
            return expList;
        } else return gList;
    }

/**
* Groups make it possible to use multiple combination operators.
* By defining groups you implicitly define the order in which your operators are handled.
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

// Recursively defines how to handle additional groups.
otherGroups
    = g:group op:andOr? other:otherGroups? {
        if(other){
            return g + ", " + other;
        } else return g;
    }


