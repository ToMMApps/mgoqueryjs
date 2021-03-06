# mgoquery.js
A simple query language that returns a valid MongoDB query.
It is meant to be much easier to use than MongoDB queries.
Furthermore it is shorter and more convenient to standard logic notations.
The parser ignores all whitespaces except for that inside of delimiters.

Installation
--------------
npm install --save mgoqueryjs

Usage
--------------
```
var Mgoquery = require('mgoqueryjs');
var mgoquery = new Mgoquery();

console.log(mgoquery.parseSync("x='3'"));
```

This should output: {'x': '3'}

Or use the asynchronous version that supports both the callback (error-first-style)- and the promise-pattern:

```
mgoquery.parseAsync("x='3'").then(function(str){
    console.log(str);
})

mgoquery.parseAsync("x='3'", function(err, str){
    console.log(str);
})
```

### Changes in 0.2.0 ###
The parse function is still supported but it is recommended to switch to the new parseSync/parseAsync functions
to avoid confusing behavior like:

```
var i = 0;

mgoquery.parse("x='3'", function(str){
    i++;
});

console.log(i); //output: 1
```

In this case the parse function seems to work asynchronous but has synchronous behavior.

Expression
--------------
Expressions consist of a field, an operator and a value. Currently there are four types of operators available:
"=" (equals), "<" (less-than), ">" (higher-than) or "^" (regular expression).

Examples:
- x='3' becomes {'x': '3'}
- foo > '4' becomes {'foo': {'$gte': '4'}}
- y < 'x' becomes {'y': {'$lte': 'x'}}
- y ^ '^-?\\d{1,19}$' becomes {'y': {'$regex': '^-?\\d{1,19}$'}}

### Changes in 0.2.0 ###
Expressions do now support integers and boolean values. For example:

- x=2 => {'x': 2}
- x>2 =>  {'x': {'$gte': 2}}
- x='2' => {'x': '2'}
- x=true => {'x': true}
- x=false => {'x': false}

Combined expressions
--------------
Expressions can be combined using "," (and) or "|" (or).

Examples:
- x='1' , y='2' becomes {'$and': [{'x': '1'}, {'y': '2'}]}
- x='1' | y='2' becomes {'$or': [{'x': '1'}, {'y': '2'}]}

As long as you use only one operator you can combine as much expressions as you want.

Example:
- x='1' , y='2' , x='3', x='3' becomes {'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}

Group
-------------
It is not possible to combine multiple expressions by using both "," and "|". The parser
cannot determine the order in which the expressions should be evaluated.
Groups can be used to describe that order. You can specify groups by using brackets.

Examples:
- (x>'1', x<'5') | (y>'2', x='None') becomes {'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
- (x>'1', x<'5') , (y>'2', x='None') becomes {'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}

At these examples you can see how much shorter this query language is.

Combined Groups
-------------

Similar to expressions you can combine a much amount of groups as long as you use only one operator.
Examples:
- (x='1', x<'1') | (y='2') | (z='3') becomes {'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
- (x='1', x<'1'), (y='2'), (z='3') becomes {'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}

Nested Groups
-------------

It is possible to define lists of groups inside of a group.

Examples:
- ((x='3'),(y='5'))|(y='4') becomes {'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}

Configuration Options
-------------
Some options can be overhanded to the constructor:

- removeAllWhitespaces: Ignores the whitespaces inside of delimiters.

Code-Quality
----------

Current Jenkins report for this project:
- ![BuildStatus](http://jenkins.tomm-apps.de/buildStatus/icon?job=tommapps_mgoqueryjs)
- ![Test](http://jenkins.tomm-apps.de:3434/badge/tommapps_mgoqueryjs/test)
- ![LastBuild](http://jenkins.tomm-apps.de:3434/badge/tommapps_mgoqueryjs/lastbuild)
- ![CodeCoverageInJenkins](http://jenkins.tomm-apps.de:3434/badge/tommapps_mgoqueryjs/coverage)
