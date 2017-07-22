var lowfat = lowfat || {};

lowfat.BoardInfo = function (cols, rows, elementsArray) {
    function getCols() {
        return cols;
    }

    function getRows() {
        return rows;
    }

    function getElementsArray() {
        return elementsArray;
    }

    return {
        getCols: getCols,
        getRows: getRows,
        getElementsArray: getElementsArray
    }
};

lowfat.Board = function (cols, rows, elementsArray, marksArray, mistakenlyMarkedCellIndexesArray) {
    var width = cols;
    var height = rows;
    var elements = elementsArray;
    var marks = initMarks(marksArray);
    var totalFilledCells = calculateTotalFilledCells();
    var guessedCellsAmount = calculateInitialGuessedCellsAmount();
    var mistakenlyMarkedCellIndexes = initMistakenlyMarkedCellIndexes(mistakenlyMarkedCellIndexesArray);

    function initMarks(marksArrayFromParams) {
        if (typeof marksArrayFromParams == "undefined" || marksArrayFromParams == null || marksArrayFromParams.length == 0) {
            var result = [];
            for (var i = 0; i < width * height; i++) {
                result.push(0);
            }
            return result;
        }

        if (marksArrayFromParams.length != width * height) {
            throw new Error("marksArray has incorrect amount of elements");
        }
        return marksArrayFromParams;
    }

    function calculateTotalFilledCells() {
        var result = 0;
        for (var i = 0; i < elementsArray.length; i++) {
            if (elementsArray[i] == 1) {
                result++;
            }
        }
        return result;
    }

    function calculateInitialGuessedCellsAmount() {
        var result = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] == 1 && marks[i] == 1) {
                result++;
            }
        }
        return result;
    }

    function initMistakenlyMarkedCellIndexes(mistakenlyMarkedCellIndexesFromParams) {
        if (typeof mistakenlyMarkedCellIndexesFromParams == "undefined" || mistakenlyMarkedCellIndexesFromParams == null || mistakenlyMarkedCellIndexesFromParams.length == 0) {
            return [];
        }
        return mistakenlyMarkedCellIndexesFromParams;
    }

    function checkGuessedCell(x, y) {
        if (getIsFilled(x, y) && getIsMarked(x, y)) {
            guessedCellsAmount++;
        }
    }

    function getGroupsInRow(row) {
        var groupLength = 0;
        var groups = [];
        for (var i = 0; i < width; i++) {
            var isFilled = this.getIsFilled(i, row);
            if (isFilled) {
                groupLength++;
            }
            if ((!isFilled || i == width - 1) && groupLength > 0) {
                groups.push(groupLength);
                groupLength = 0;
            }
        }
        return groups;
    }

    function getGroupsInCol(col) {
        var groupLength = 0;
        var groups = [];
        for (var i = 0; i < height; i++) {
            var isFilled = this.getIsFilled(col, i);
            if (isFilled) {
                groupLength++;
            }
            if ((!isFilled || i == height - 1) && groupLength > 0) {
                groups.push(groupLength);
                groupLength = 0;
            }
        }
        return groups;
    }

    function getMarkedGroupsInRow(row) {
        var groupLength = 0;
        var groupIsMarkedCompletely = true;
        var markedGroups = [];
        for (var i = 0; i < width; i++) {
            var isFilled = this.getIsFilled(i, row);
            if (isFilled) {
                groupLength++;
                if (!getIsMarked(i, row)) {
                    groupIsMarkedCompletely = false;
                }
            }
            if ((!isFilled || i == width - 1) && groupLength > 0) {
                markedGroups.push(groupIsMarkedCompletely);
                groupIsMarkedCompletely = true;
                groupLength = 0;
            }
        }
        return markedGroups;
    }

    function getMarkedGroupsInCol(col) {
        var groupLength = 0;
        var groupIsMarkedCompletely = true;
        var markedGroups = [];
        for (var i = 0; i < height; i++) {
            var isFilled = this.getIsFilled(col, i);
            if (isFilled) {
                groupLength++;
                if (!getIsMarked(col, i)) {
                    groupIsMarkedCompletely = false;
                }
            }
            if ((!isFilled || i == height - 1) && groupLength > 0) {
                markedGroups.push(groupIsMarkedCompletely);
                groupIsMarkedCompletely = true;
                groupLength = 0;
            }
        }
        return markedGroups;
    }

    function getBiggestGroupsAmountInRows() {
        var result = 0;
        for (var row = 0; row < height; row++) {
            var groupsInRow = this.getGroupsInRow(row).length;
            if (result < groupsInRow) {
                result = groupsInRow;
            }
        }
        return result;
    }

    function getBiggestGroupsAmountInCols() {
        var result = 0;
        for (var col = 0; col < width; col++) {
            var groupsInCol = this.getGroupsInCol(col).length;
            if (result < groupsInCol) {
                result = groupsInCol;
            }
        }
        return result;
    }

    function getTotalFilledCells() {
        return totalFilledCells;
    }

    function getGuessedCellsAmount() {
        return guessedCellsAmount;
    }

    function getIsSolved() {
        return getGuessedCellsAmount() == getTotalFilledCells();
    }

    function mark(x, y, ignoreMistakenlyMarkedCellCheck) {
        checkBounds(x, y);
        if (this.getIsMarked(x, y) == true) {
            throw new Error("Cell " + x + ", " + y + " is already marked");
        }

        if (ignoreMistakenlyMarkedCellCheck !== true && this.getIsFilled(x, y) == false) {
            mistakenlyMarkedCellIndexes.push(getCellIndex(x, y));
        }

        marks [getCellIndex(x, y)] = 1;
        checkGuessedCell(x, y);
    }

    function getIsFilled(x, y) {
        checkBounds(x, y);
        return elements[getCellIndex(x, y)] == 1;
    }

    function getIsMarked(x, y) {
        checkBounds(x, y);
        return marks[getCellIndex(x, y)] == 1;
    }

    function getIsMistakenlyMarked(x, y) {
        return mistakenlyMarkedCellIndexes.indexOf(getCellIndex(x, y)) >= 0;
    }

    function getWidth() {
        return width;
    }

    function getHeight() {
        return height;
    }

    function checkBounds(x, y) {
        if (x >= width || x < 0 || y >= height || y < 0) {
            throw new Error("Cell " + x + ", " + y + " is out of bounds");
        }
    }

    function getCellIndex(x, y) {
        return y * width + x;
    }

    function getMarkedCells() {
        return marks;
    }

    function getMistakenlyMarkedCells() {
        return mistakenlyMarkedCellIndexes;
    }

    return {
        getHeight: getHeight,
        getWidth: getWidth,
        getBiggestGroupsAmountInRows: getBiggestGroupsAmountInRows,
        getBiggestGroupsAmountInCols: getBiggestGroupsAmountInCols,
        getGroupsInCol: getGroupsInCol,
        getGroupsInRow: getGroupsInRow,
        getGuessedCellsAmount: getGuessedCellsAmount,
        getTotalFilledCells: getTotalFilledCells,
        getIsFilled: getIsFilled,
        getIsMarked: getIsMarked,
        getIsMistakenlyMarked: getIsMistakenlyMarked,
        getIsSolved: getIsSolved,
        getMarkedGroupsInRow: getMarkedGroupsInRow,
        getMarkedGroupsInCol: getMarkedGroupsInCol,
        getMarkedCells: getMarkedCells,
        getMistakenlyMarkedCells: getMistakenlyMarkedCells,
        mark: mark
    };
};