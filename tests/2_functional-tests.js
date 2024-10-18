const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
    it("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.solution);
                assert.equal(
                    res.body.solution,
                    "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
                );
                done();
            });
    });

    it("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.equal(res.body.error, "Required field missing");
                done();
            });
    });

    it("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "Abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });

    it("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.equal(
                    res.body.error,
                    "Expected puzzle to be 81 characters long"
                );
                done();
            });
    });

    it("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(res.body.error, "Puzzle cannot be solved");
                done();
            });
    });

    it("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "5",
                coordinate: "B8",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isBoolean(res.body.valid);
                assert.isTrue(res.body.valid);
                done();
            });
    });

    it("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "5",
                coordinate: "B2",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict[0], "region");
                done();
            });
    });

    it("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "1",
                coordinate: "B2",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.deepEqual(res.body.conflict, ["row", "region"]);
                done();
            });
    });

    it("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "6",
                coordinate: "B2",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
                done();
            });
    });

    it("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "",
                coordinate: "",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            });
    });

    it("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "Abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "5",
                coordinate: "B8",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });

    it("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
                value: "5",
                coordinate: "B8",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(
                    res.body.error,
                    "Expected puzzle to be 81 characters long"
                );
                done();
            });
    });

    it("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "5",
                coordinate: "J8",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            });
    });

    it("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "Q",
                coordinate: "B8",
            })
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.error);
                assert.equal(res.body.error, "Invalid value");
                done();
            });
    });
});
