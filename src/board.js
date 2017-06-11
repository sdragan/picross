var lowfat = lowfat || {};

lowfat.Board = function (cols, rows, elementsArray, marksArray) {
    var that = this;
    var width = cols;
    var height = rows;
    var elements = elementsArray;
    var marks = initMarks(marksArray);
    var totalFilledCells = calculateTotalFilledCells();
    var guessedCellsAmount = calculateInitialGuessedCellsAmount();

    function initMarks(marksArrayFromParams) {
        if (typeof marksArrayFromParams == "undefined" || marksArrayFromParams == null || marksArrayFromParams.length == 0) {
            var result = [];
            for (var i = 0; i < that.width * that.height; i++) {
                result.push(0);
            }
            return result;
        }

        if (marksArrayFromParams.length != width * height) {
            throw new Error ("marksArray has incorrect amount of elements");
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

    function checkGuessedCell(x, y) {
        if (that.getIsFilled(x, y) && that.getIsMarked(x, y)) {
            guessedCellsAmount++;
        }
    }

    this.getGroupsInRow = function (row) {
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
    };

    this.getGroupsInCol = function (col) {
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
    };

    this.getMarkedGroupsInRow = function (row) {
        var groupLength = 0;
        var groupIsMarkedCompletely = true;
        var markedGroups = [];
        for (var i = 0; i < width; i++) {
            var isFilled = this.getIsFilled(i, row);
            if (isFilled) {
                groupLength++;
                if (!that.getIsMarked(i, row)) {
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
    };

    this.getMarkedGroupsInCol = function (col) {
        var groupLength = 0;
        var groupIsMarkedCompletely = true;
        var markedGroups = [];
        for (var i = 0; i < height; i++) {
            var isFilled = this.getIsFilled(col, i);
            if (isFilled) {
                groupLength++;
                if (!that.getIsMarked(col, i)) {
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
    };

    this.getBiggestGroupsAmountInRows = function () {
        var result = 0;
        for (var row = 0; row < height; row++) {
            var groupsInRow = this.getGroupsInRow(row).length;
            if (result < groupsInRow) {
                result = groupsInRow;
            }
        }
        return result;
    };

    this.getBiggestGroupsAmountInCols = function () {
            var result = 0;
            for (var col = 0; col < width; col++) {
                var groupsInCol = this.getGroupsInCol(col).length;
                if (result < groupsInCol) {
                    result = groupsInCol;
                }
            }
            return result;
        };

    this.getTotalFilledCells = function () {
        return totalFilledCells;
    };

    this.getGuessedCellsAmount = function () {
        return guessedCellsAmount;
    };

    this.mark = function (x, y) {
        checkBounds(x, y);
        if (this.getIsMarked(x, y) == true) {
            throw new Error("Cell " + x + ", " + y + " is already marked");
        }
        marks [y * width + x] = 1;
        checkGuessedCell(x, y);
    };

    this.getIsFilled = function (x, y) {
        checkBounds(x, y);
        return elements[y * width + x] == 1;
    };

    this.getIsMarked = function (x, y) {
        checkBounds(x, y);
        return marks[y * width + x] == 1;
    };

    this.getWidth = function () {
        return width;
    };

    this.getHeight = function () {
        return height;
    };

    function checkBounds(x, y) {
        if (x >= width || x < 0 || y >= height || y < 0) {
            throw new Error("Cell " + x + ", " + y + " is out of bounds");
        }
    }
};