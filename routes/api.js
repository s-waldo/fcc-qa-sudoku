"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
    let solver = new SudokuSolver();

    const puzzleValidation = (req, res, next) => {
        let puzzle = req.body.puzzle;
        if (!puzzle) {
            res.json({ error: "Required field missing" });
            return;
        }
        // returns true or Error String
        const isValid = solver.validate(puzzle);
        if (isValid !== true) {
            res.json({ error: isValid });
            return;
        }
        next();
    };

    const coordinateValidation = (req, res, next) => {
        let coordinate = req.body.coordinate;
        if (!/[a-iA-I][1-9]/.test(coordinate) || coordinate.length > 2) {
            res.json({ error: "Invalid coordinate" });
            return;
        }
        next();
    };

    const valueValidation = (req, res, next) => {
        let value = Number(req.body.value);

        if (!value || !/[1-9]/.test(value)) {
            res.json({ error: "Invalid value" });
            return;
        }
        next();
    };

    app.route("/api/check").post(
        puzzleValidation,
        coordinateValidation,
        valueValidation,
        (req, res) => {
            let puzzle = req.body.puzzle;
            let coordinate = req.body.coordinate;
            let value = Number(req.body.value);

            let [row, col] = coordinate.split("");
            col = Number(col) - 1;
            puzzle = solver.convertStringToArray(puzzle);
            // Check if cell is already value
            const currCellValue = puzzle[solver.convertRowToDigit(row)][col];
            if (value == currCellValue) {
                res.json({ valid: true });
                return;
            }
            // check for value failings
            const errors = [];
            if (!solver.checkRowPlacement(puzzle, row, col, value)) {
                errors.push("row");
            }
            if (!solver.checkColPlacement(puzzle, row, col, value)) {
                errors.push("col");
            }
            if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
                errors.push("region");
            }

            if (errors.length > 0) {
                res.json({ valid: false, conflict: errors });
                return;
            }

            res.json({ valid: true });
        }
    );

    app.route("/api/solve").post(puzzleValidation, (req, res) => {
        let puzzle = req.body.puzzle;
        puzzle = solver.convertStringToArray(puzzle);
        puzzle = solver.solve(puzzle);
        if (!puzzle) {
            res.json({ error: "Puzzle cannot be solved" });
            return;
        }
        res.json({ solution: puzzle });
    });
};
