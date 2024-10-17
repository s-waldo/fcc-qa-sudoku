const chai = require("chai");
const assert = chai.assert;
import { puzzlesAndSolutions } from "../controllers/puzzle-strings.js";

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const puzzle1 = puzzlesAndSolutions[0][0]
const puzzle2 = puzzlesAndSolutions[1][0]
const puzzle3 = puzzlesAndSolutions[2][0]
const puzzle4 = puzzlesAndSolutions[3][0]
const puzzle5 = puzzlesAndSolutions[4][0]
const solution1 = puzzlesAndSolutions[0][1]
const solution2 = puzzlesAndSolutions[1][1]
const solution3 = puzzlesAndSolutions[2][1]
const solution4 = puzzlesAndSolutions[3][1]
const solution5 = puzzlesAndSolutions[4][1]

describe("Unit Tests", () => {

    const array1 = solver.convertStringToArray(puzzle1)
    const array2 = solver.convertStringToArray(puzzle2)
    const array3 = solver.convertStringToArray(puzzle3)
    const array4 = solver.convertStringToArray(puzzle4)
    const array5 = solver.convertStringToArray(puzzle5)
  it("Logic handles a valid puzzle string of 81 characters", () => {
    assert.isTrue(solver.validate(puzzle1))
    assert.isTrue(solver.validate(puzzle2))
    assert.isTrue(solver.validate(puzzle3))
    assert.isTrue(solver.validate(puzzle4))
    assert.isTrue(solver.validate(puzzle5))
  });

  it("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const badPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3AE4.3.7.2..9.47...8..1..16....926914.37.'
    assert.isFalse(solver.validate(badPuzzle))
  });

  it("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.isFalse(solver.validate('0.987.444.3'))
  });

  it("Logic handles a valid row placement", () => {
    assert.isTrue(solver.checkRowPlacement(array1, "A", 1, '3'))
    assert.isTrue(solver.checkRowPlacement(array2, "I", 7, '4'))
    assert.isTrue(solver.checkRowPlacement(array3, "A", 0, '2'))
    assert.isTrue(solver.checkRowPlacement(array5, "A", 3, '5'))
  });

  it("Logic handles an invalid row placement", () => {
    assert.isFalse(solver.checkRowPlacement(array1, "A", 1, '1'))
    assert.isFalse(solver.checkRowPlacement(array2, "I", 7, '3'))
    assert.isFalse(solver.checkRowPlacement(array3, "A", 0, '8'))
    assert.isFalse(solver.checkRowPlacement(array5, "A", 3, '8'))
  });

  it("Logic handles a valid column placement", () => {
    assert.isTrue(solver.checkColPlacement(array1, "A", 1, '3'))
    assert.isTrue(solver.checkColPlacement(array2, "I", 7, '4'))
    assert.isTrue(solver.checkColPlacement(array3, "A", 0, '2'))
    assert.isTrue(solver.checkColPlacement(array5, "A", 3, '5'))
  });

  it("Logic handles an invalid column placement", () => {
    assert.isFalse(solver.checkColPlacement(array1, "A", 1, '7'))
    assert.isFalse(solver.checkColPlacement(array2, "I", 7, '3'))
    assert.isFalse(solver.checkColPlacement(array3, "A", 0, '4'))
    assert.isFalse(solver.checkColPlacement(array5, "A", 3, '8'))
  });

  it("Logic handles a valid region (3x3 grid) placement", () => {
    assert.isTrue(solver.checkRegionPlacement(array1, "A", 1, '3'))
    assert.isTrue(solver.checkRegionPlacement(array2, "I", 7, '4'))
    assert.isTrue(solver.checkRegionPlacement(array3, "A", 0, '2'))
    assert.isTrue(solver.checkRegionPlacement(array5, "A", 3, '5'))
  });

  it("Logic handles an invalid region (3x3 grid) placement", () => {
    assert.isFalse(solver.checkRegionPlacement(array1, "A", 1, '1'))
    assert.isFalse(solver.checkRegionPlacement(array2, "I", 7, '3'))
    assert.isFalse(solver.checkRegionPlacement(array3, "A", 0, '8'))
    assert.isFalse(solver.checkRegionPlacement(array5, "A", 3, '8'))
  });

  it("Valid puzzle strings pass the solver", () => {
    assert.isOk(solver.solve(array1))
    assert.isOk(solver.solve(array2))
    assert.isOk(solver.solve(array3))
    assert.isOk(solver.solve(array4))
    assert.isOk(solver.solve(array5))  
  });

  it("Invalid puzzle strings fail the solver", () => {

    const invalidString = '15...2.84..63.12.7.2..5.....9..1....8.2.3AE4.3.7.2..9.47...8..1..16....926914.37.'

    assert.isFalse(solver.solve(solver.convertStringToArray(invalidString)))
  });

  it("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.equal(solver.solve(array1), solution1)
    assert.equal(solver.solve(array2), solution2)
    assert.equal(solver.solve(array3), solution3)
    assert.equal(solver.solve(array4), solution4)
    assert.equal(solver.solve(array5), solution5) 
  });
});
