class SudokuSolver {
  convertRowToDigit(row) {
    return row.toUpperCase().charCodeAt(0) - 65;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) return false;
    puzzleString.forEach((char) => {
      let regex = /[0-9\.]/;
      if (!regex.test(char)) {
        return false;
      }
    });
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let testChar = isNaN(row) ? this.convertRowToDigit(row) : row;
    let i = testChar * 9;
    for (let j = 0; j < 9; j++) {
      const testValue = puzzleString[i + j];
      if (value == testValue) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      const testValue = puzzleString[column + i * 9];
      if (value == testValue) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowDigit = isNaN(row) ? this.convertRowToDigit(row) : row;
    const rowStart = Math.floor(rowDigit / 3) * 3;
    const colStart = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const testValue = puzzleString[colStart + i * 9 + rowStart + j];
        if (testValue == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    while (puzzleString.includes(".")) {
      for (let i = 0; i < 81; i++) {
        if (puzzleString[i] === ".") {
          const solutions = new Set();
          for (let j = 1; j < 10; j++) {
            if (this.checkRowPlacement(puzzleString, Math.floor(i / 9), i % 9, j) &&
                this.checkColPlacement(puzzleString, Math.floor(i / 9), i % 9, j) &&
                this.checkRegionPlacement(puzzleString, Math.floor(i / 9), i % 9, j)) {
              solutions.add(j);
            }
          }
          if (solutions.size === 1) {
            puzzleString[i] = solutions.keys()[0];
          }
          if (solutions.size === 0) {
            return false
          }
        }
      }
    }
    return puzzleString
  }
}

module.exports = SudokuSolver;
