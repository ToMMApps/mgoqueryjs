# mgoquery.js
A simple query language that returns a valid MongoDB query.
It is meant to be much easier to use than MongoDB queries.
Furthermore it is shorter and more convenient to standard logic notations.

Attention! Please beware of the fact that all whitespaces are ignored. This includes whitespaces inside of apostrophes!

Expression
--------------
Expressions consist of a field, an operator and a value. Currently there are four types of operators available:
"=" (equals), "<" (less-than), ">" (higher-than) or "^" (regular expression).

Examples:
<<<<<<< HEAD
x='3' => {'x': '3'}
foo > '4' => {'foo': {'$gte': '4'}}
y < 'x' => {'y': {'$lte': 'x'}}
y ^ '^-?\\d{1,19}$' => {'y': {'$regex': '^-?\\d{1,19}$'}}
=======
- x=3 becomes {'x': '3'}
- foo => 4 becomes {'foo': {'$gte': '4'}}
- y < x becomes {'y': {'$lte': 'x'}}
>>>>>>> origin/master

Combined expressions
--------------
Expressions can be combined using "," (and) or "|" (or).

Examples:
<<<<<<< HEAD
- x='1' , y='2' => {'$and': [{'x': '1'}, {'y': '2'}]}
- x='1' | y='2' => {'$or': [{'x': '1'}, {'y': '2'}]}
=======
- x=1 , y=2 becomes {'$and': [{'x': '1'}, {'y': '2'}]}
- x=1 | y=2 becomes {'$or': [{'x': '1'}, {'y': '2'}]}
>>>>>>> origin/master

As long as you use only one operator you can combine as much expressions as you want.

Example:
<<<<<<< HEAD
- x='1' , y='2' , x='3', x='3' => {'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}
=======
- x=1 , y=2 , x=3, x=3 becomes {'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}
>>>>>>> origin/master

Group
-------------
It is not possible to combine multiple expressions by using both "," and "|". The parser
cannot determine the order in which the expressions should be evaluated.
Groups can be used to describe that order. You can specify groups by using brackets.

Examples:
<<<<<<< HEAD
- (x>'1', x<'5') | (y>'2', x='None') => {'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
- (x>'1', x<'5') , (y>'2', x='None') => {'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
=======
- (x>1, x<5) | (y>2, x=None) becomes {'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
- (x>1, x<5) , (y>2, x=None) becomes {'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}
>>>>>>> origin/master

At these examples you can see how much shorter this query language is.

Combined Groups
-------------

Similar to expressions you can combine a much amount of groups as long as you use only one operator.
Examples:
<<<<<<< HEAD
- (x='1', x<'1') | (y='2') | (z='3') => {'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
- (x='1', x<'1'), (y='2'), (z='3') => {'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
=======
- (x=1, x<1) | (y=2) | (z=3) becomes {'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
- (x=1, x<1), (y=2), (z=3) becomes {'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}
>>>>>>> origin/master

Nested Groups
-------------

It is possible to define lists of groups inside of a group.

Examples:
<<<<<<< HEAD
- ((x='3'),(y='5'))|(y='4') => {'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}

Missing
-------------

- Keep whitespaces inside of apostrophes

=======
- ((x=3),(y=5))|(y=4) becomes {'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}
>>>>>>> origin/master
