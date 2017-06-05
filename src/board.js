var lowfat = lowfat || {};

lowfat.Board = function (cols, rows, elementsArray, marksArray) {
    var that = this;
    var width = cols;
    var height = rows;
    var elements = elementsArray;
    var marks = initMarks(marksArray);

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

    this.mark = function (x, y) {
        checkBounds(x, y);
        if (this.getIsMarked(x, y) == true) {
            throw new Error("Cell " + x + ", " + y + " is already marked");
        }
        marks [y * width + x] = 1;
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