var Mgoquery = require('./../parser');

var mgoquery = new Mgoquery();

describe("grammar", function(){
    it("must handle equals expressions", function(done){
        mgoquery.parse("x=3", function(str){
            expect(str).toEqual("{'x': '3'}");
            done();
        });
    });

    it("must handle greater-than (>) expressions", function(done){
        mgoquery.parse("foo > 4", function(str){
            expect(str).toEqual("{'foo': {'$gte': '4'}}");
            done();
        });
    });

    it("must handle less-than expressions", function(done){
        mgoquery.parse("y < x", function(str){
            expect(str).toEqual("{'y': {'$lte': 'x'}}");
            done();
        });
    });

    it("must handle special characters", function(done){
        mgoquery.parse("aA_- = aA_-0", function(str){
            expect(str).toEqual("{'aA_-': 'aA_-0'}");
            done();
        });
    });

    it("must handle and-combined expressions", function(done){
        mgoquery.parse("x=1 , y=2", function(str){
            expect(str).toEqual("{'$and': [{'x': '1'}, {'y': '2'}]}");
            done();
        });
    });

    it("must handle or-combined expressions", function(done){
        mgoquery.parse("x=1 | y=2", function(str){
            expect(str).toEqual("{'$or': [{'x': '1'}, {'y': '2'}]}");
            done();
        });
    });

    it("must handle multiple and-combined expressions", function(done){
        mgoquery.parse("x=1 , y=2 , x=3, x=3", function(str){
            expect(str).toEqual("{'$and': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}");
            done();
        });
    });

    it("must handle multiple or-combined expressions", function(done){
        mgoquery.parse("x=1 | y=2 | x=3 | x=3", function(str){
            expect(str).toEqual("{'$or': [{'x': '1'}, {'y': '2'}, {'x': '3'}, {'x': '3'}]}");
            done();
        });
    });

    it("must handle or-combined groups", function(done){
        mgoquery.parse("(x>1, x<5) | (y>2, x=None)", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}");
            done();
        });
    });

    it("must handle and-combined groups", function(done){
        mgoquery.parse("(x>1, x<5) , (y>2, x=None)", function(str){
            expect(str).toEqual("{'$and': [{'$and': [{'x': {'$gte': '1'}}, {'x': {'$lte': '5'}}]}, {'$and': [{'y': {'$gte': '2'}}, {'x': 'None'}]}]}");
            done();
        });
    });

    it("must handle multiple or-combined groups", function(done){
        mgoquery.parse("(x=1, x<1) | (y=2) | (z=3)", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}");
            done();
        });
    });

    it("must handle multiple and-combined groups", function(done){
        mgoquery.parse("(x=1, x<1), (y=2), (z=3)", function(str){
            expect(str).toEqual("{'$and': [{'$and': [{'x': '1'}, {'x': {'$lte': '1'}}]}, {'y': '2'}, {'z': '3'}]}");
            done();
        });
    });

    it("must handle nested groups", function(done){
        mgoquery.parse("((x=3),(y=5))|(y=4)", function(str){
            expect(str).toEqual("{'$or': [{'$and': [{'x': '3'}, {'y': '5'}]}, {'y': '4'}]}");
            done();
        })
    })
});