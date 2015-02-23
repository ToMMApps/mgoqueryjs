# mgoquery.js
A simple query language that returns a valid MongoDB query.
It is meant to be much easier to use than MongoDB queries.
Furthermore it is shorter and more convenient to standard logic notations.

Expression
--------------
Expressions consist of a field, an operator and a value. Currently there are three types of operators available:
"=" (equals), "<" (less-than) and ">" (higher-than).

Examples:
- x=3 becomes {'x': '3'}
- foo => 4 becomes {'foo': {'$gte': '4'}}
- y < x becomes {'y': {'$lte': 'x'}}

Combined expressions
--------------
Expressions can be combined using "," (and) or "|" (or).

Examples:
- x=1 , y=2 becomes {'$and': [{'x': '1'}, {'y': '2'}]}
- x=1 | y=2 becomes {'$or': [{'x': '1'}, {'y': '2'}]}

As long as you use only one operator you can combine as much expressions as you want.

Example:
- x=1 , y=2 , x=3, x=3 becomes {'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}

Group
-------------
It is not possible to combine multiple expressions by using both "," and "|". The parser
cannot determine the order in which the expressions should be evaluated.
Groups can be used to describe that order. You can specify groups by using brackets.

Examples:
- (x>1, x<5) | (y>2, x=None) becomes {'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
- (x>1, x<5) , (y>2, x=None) becomes {'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}

At these examples you can see how much shorter this query language is.

Combined Groups
-------------

Similar to expressions you can combine a much amount of groups as long as you use only one operator.
Examples:
- (x=1, x<1) | (y=2) | (z=3) becomes {'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
- (x=1, x<1), (y=2), (z=3) becomes {'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}

Nested Groups
-------------

It is possible to define lists of groups inside of a group.

Examples:
- ((x=3),(y=5))|(y=4) becomes {'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}
