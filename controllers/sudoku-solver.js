class SudokuSolver {
    convertRowToDigit(row) {
        return row.toUpperCase().charCodeAt(0) - 65;
    }

    convertStringToArray(puzzleString) {
        let puzzleArray = [];
        for (let i = 0; i < 9; i++) {
            puzzleArray.push([]);
            for (let j = 0; j < 9; j++) {
                puzzleArray[i].push(puzzleString[i * 9 + j]);
            }
        }
        return puzzleArray;
    }

    validate(puzzleString) {
        if (puzzleString.length !== 81) {
            return "Expected puzzle to be 81 characters";
        }
        for (const char of puzzleString) {
            let regex = /[0-9\.]/;
            if (!regex.test(char)) {
                return "Invalid characters in puzzle";
            }
        }
        return true;
    }

    checkRowPlacement(puzzleArray, row, column, value) {
        let testChar = isNaN(row) ? this.convertRowToDigit(row) : row;
        for (let i = 0; i < 9; i++) {
            if (puzzleArray[testChar][i] == value) return false;
        }
        return true;
    }

    checkColPlacement(puzzleArray, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (puzzleArray[i][column] == value) return false;
        }
        return true;
    }

    checkRegionPlacement(puzzleArray, row, column, value) {
        const rowDigit = isNaN(row) ? this.convertRowToDigit(row) : row;
        const rowStart = Math.floor(rowDigit / 3) * 3;
        const colStart = Math.floor(column / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (puzzleArray[rowStart + i][colStart + j] == value) {
                    return false;
                }
            }
        }
        return true;
    }

    isValidGuess(puzzleArray, row, col, guess) {
        if (
            this.checkRowPlacement(puzzleArray, row, col, guess) &&
            this.checkColPlacement(puzzleArray, row, col, guess) &&
            this.checkRegionPlacement(puzzleArray, row, col, guess)
        ) {
            return true;
        }
        return false;
    }

    solve(puzzleArray) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (puzzleArray[row][col] == ".") {
                    for (let guess = 1; guess <= 9; guess++) {
                        if (this.isValidGuess(puzzleArray, row, col, guess)) {
                            puzzleArray[row][col] = guess;
                            if (this.solve(puzzleArray)) {
                                return puzzleArray
                                    .map((el) => el.join(""))
                                    .join("");
                            }
                        }
                    }
                    puzzleArray[row][col] = ".";
                    return false;
                }
            }
        }
        return puzzleArray.map((el) => el.join("")).join("");
    }
}

module.exports = SudokuSolver;
