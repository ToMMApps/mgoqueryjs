var Mgoquery = require('./../parser');

var mgoquery = new Mgoquery();

describe("api", function () {
    it("parse must call its callback synchronous", function (done) {
        var i = 0;

        mgoquery.parse("x=3", function (str) {
            expect(str).toBe("{'x': 3}");
            i++; done();
        });

        expect(i).toBe(1);
    });

    it("parseSync must call its callback synchronous", function () {
        expect(mgoquery.parseSync("x=3")).toBe("{'x': 3}");
    });

    it("parseAsync must call its callback asynchronous", function (done) {
        var i = 0;

        mgoquery.parseAsync("x=3", function (err, str) {
            expect(err).toBeNull();
            expect(str).toBe("{'x': 3}");
            i++; done();
        });

        expect(i).toBe(0);
    });

    it("parseAsync must return a promise", function (done) {
        var i = 0;

        mgoquery.parseAsync("x=3").then(function (str) {
            expect(str).toBe("{'x': 3}");
            done();
        });

        expect(i).toBe(0);
    });
});