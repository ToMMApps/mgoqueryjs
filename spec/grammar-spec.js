var Mgoquery = require('./../parser');

var mgoquery = new Mgoquery();

describe("grammar", function(){
    it("must handle equals expressions with strings", function(done){
        mgoquery.parse("x='3'", function(str){
            expect(str).toEqual("{'x': '3'}");
            done();
        });
    });

    it("must handle equals expressions with integers", function(done){
        mgoquery.parse("x=3", function(str){
            expect(str).toEqual("{'x': 3}");
            done();
        });
    });

    it("must handle equals expressions with integers with more than one digit ", function(done){
        mgoquery.parse("x=3748569", function(str){
            expect(str).toEqual("{'x': 3748569}");
            done();
        });
    });

    it("must handle equals expressions with boolean true", function(done){
        mgoquery.parse("x=true", function(str){
            expect(str).toEqual("{'x': true}");
            done();
        });
    });

    it("must handle equals expressions with boolean false", function(done){
        mgoquery.parse("x=false", function(str){
            expect(str).toEqual("{'x': false}");
            done();
        });
    });

    it("must throw an exception if boolean false is used with a non-equals operator", function(){
        expect(function () {
            mgoquery.parseSync("x>false");
        }).toThrow();
    });

    it("must throw an exception if boolean true is used with a non-equals operator", function(){
        expect(function () {
            mgoquery.parseSync("x>true");
        }).toThrow();
    });

    it("must handle greater-than (>) expressions with strings", function(done){
        mgoquery.parse("foo > '4'", function(str){
            expect(str).toEqual("{'foo': {'$gte': '4'}}");
            done();
        });
    });

    it("must handle less-than (<) expressions with strings", function(done){
        mgoquery.parse("y < 'x'", function(str){
            expect(str).toEqual("{'y': {'$lte': 'x'}}");
            done();
        });
    });

    it("must handle greater-than (>) expressions with integers", function(done){
        mgoquery.parse("foo > 4", function(str){
            expect(str).toEqual("{'foo': {'$gte': 4}}");
            done();
        });
    });

    it("must handle less-than (<) expressions with integers", function(done){
        mgoquery.parse("y < 6", function(str){
            expect(str).toEqual("{'y': {'$lte': 6}}");
            done();
        });
    });

    it("must throw an exception if integers are used with the regex operator", function(done){
        expect(function () {
            mgoquery.parse("y ^ 2");
        }).toThrow();

        done();
    });

    it("must handle regular expressions", function(done){
        mgoquery.parse("y ^ '^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$'", function(str){
            expect(str).toEqual("{'y': {'$regex': '^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$'}}");
            done();
        });
    });

    it("must handle special characters", function(done){
        mgoquery.parse("aA_-0&%$?.: = 'aA_-0&%$?.:'", function(str){
            expect(str).toEqual("{'aA_-0&%$?.:': 'aA_-0&%$?.:'}");
            done();
        });
    });

    it("must handle and-combined expressions", function(done){
        mgoquery.parse("x='1' , y='2'", function(str){
            expect(str).toEqual("{'$and': [{'x': '1'}, {'y': '2'}]}");
            done();
        });
    });

    it("must handle or-combined expressions", function(done){
        mgoquery.parse("x='1' | y='2'", function(str){
            expect(str).toEqual("{'$or': [{'x': '1'}, {'y': '2'}]}");
            done();
        });
    });

    it("must handle mixed expressions", function(done){
        mgoquery.parse("x=1 | y='2'", function(str){
            expect(str).toEqual("{'$or': [{'x': 1}, {'y': '2'}]}");
            done();
        });
    });

    it("must handle multiple and-combined expressions", function(done){
        mgoquery.parse("x='1' , y='2' , x='3', x='3'", function(str){
            expect(str).toEqual("{'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}");
            done();
        });
    });

    it("must handle multiple or-combined expressions", function(done){
        mgoquery.parse("x='1' | y='2' | x='3' | x='3'", function(str){
            expect(str).toEqual("{'$or': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}");
            done();
        });
    });

    it("must handle groups", function(done){
        mgoquery.parse("(x>'1', x<'5')", function(str){
            expect(str).toEqual("{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}");
            done();
        });
    });

    it("must handle or-combined groups", function(done){
        mgoquery.parse("(x>'1', x<'5') | (y>'2', x='None')", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}");
            done();
        });
    });

    it("must handle and-combined groups", function(done){
        mgoquery.parse("(x>'1', x<'5') , (y>'2', x='None')", function(str){
            expect(str).toEqual("{'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}");
            done();
        });
    });

    it("must handle multiple or-combined groups", function(done){
        mgoquery.parse("(x='1', x<'1') | (y='2') | (z='3')", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}");
            done();
        });
    });

    it("must handle multiple and-combined groups", function(done){
        mgoquery.parse("(x='1', x<'1'), (y='2'), (z='3')", function(str){
            expect(str).toEqual("{'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}");
            done();
        });
    });

    it("must handle nested groups", function(done){
        mgoquery.parse("((x='3'),(y='5'))|(y='4')", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}");
            done();
        })
    });

    it("must keep whitespaces inside of delimiters", function(done){
        mgoquery.parse("x = 'test test'", function(str){
            expect(str).toEqual("{'x': 'test test'}");
            done();
        })
    });

    it("must ignore whitespaces if requested", function(done){
        var modMgoquery = new Mgoquery({removeAllWhitespaces:true});
        modMgoquery.parse("x = 'test test'", function(str){
            expect(str).toEqual("{'x': 'testtest'}");
            done();
        })
    });

    it("must not put extra commas into strings", function(done){
       mgoquery.parse("fieldStr = 'valueStr'", function(str){
           expect(str).toEqual("{'fieldStr': 'valueStr'}");
           done();
       })
    });

    it("must throw an exception if the input string is empty", function(done){
        expect(function(){
            mgoquery.parse("")
        }).toThrow();
        done();
    });

    it("must throw an exception if the value is not surrounded by delimiters", function(done){
        expect(function(){
            mgoquery.parse("fieldStr = valueStr")
        }).toThrow();
        done();
    });

    it("must throw an exception if field contains invalid symbols", function(done){
        var invalidSymbols = ",|<>=^";

        for(var i in invalidSymbols){
            expect(function(){
                mgoquery.parse(invalidSymbols[i] + " = 'value'")
            }).toThrow();
        }
        done();
    });

    it("must throw an exception if value contains invalid symbols", function(done){
        try{
            mgoquery.parse("field = '''");
        } catch (Exception){
            done();
        }
    });

    it("must throw an exception if value is empty", function(done){
        expect(function(){
            mgoquery.parse("field = ''")
        }).toThrow();
        done();
    });

    it("must throw an exception if the expression combination operator is unknown", function(done){
        expect(function(){
            mgoquery.parse("field = 'value' ? field = 'value'")
        }).toThrow();
        done();
    });

    it("must throw an exception if the group combination operator is unknown", function(done){
        expect(function(){
            mgoquery.parse("(field = 'value') ? (field = 'value')")
        }).toThrow();
        done();
    });

    it("must throw an exception if a group is not closed", function(done){
        expect(function(){
            mgoquery.parse("(field='value'")
        }).toThrow();
        done();
    });

    it("must throw an exception if the user attempts to combine a group with an expression", function(done){
        expect(function(){
            mgoquery.parse("(x='3'), x='3'")
        }).toThrow();
        done();
    });

    it("must throw an exception if the user attempts to combine an expression with a group", function(done){
        expect(function(){
            mgoquery.parse("x='3', (x='3')")
        }).toThrow();
        done();
    });

    it("must throw an exception if the user attempts to combine a list of groups with an expression", function(done){
        expect(function(){
            mgoquery.parse("(x='3'), (y='3'), x='3'")
        }).toThrow();
        done();
    });

    it("must throw an exception if the user attempts to combine a list of expressions with a group", function(done){
        expect(function(){
            mgoquery.parse("x='3', y='3', (x='3')")
        }).toThrow();
        done();
    });

});