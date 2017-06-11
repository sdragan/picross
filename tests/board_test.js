describe("Board", function () {
    var board;
    var BOARD_PRESET_WIDTH = 4;
    var BOARD_PRESET_HEIGHT = 5;
    var BOARD_PRESET = [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1];

    /**
     *   0 1 0 1
     *   0 0 0 0
     *   1 1 1 1
     *   0 1 1 1
     *   1 0 1 1
     */

    beforeEach(function () {
        board = new lowfat.Board(BOARD_PRESET_WIDTH, BOARD_PRESET_HEIGHT, BOARD_PRESET);
    });

    it("should return width and height", function () {
        expect(board.getWidth()).toBe(4);
        expect(board.getHeight()).toBe(5);
    });

    it("should return filled cells", function () {
        expect(board.getIsFilled(0, 0)).toBe(false);
        expect(board.getIsFilled(1, 2)).toBe(true);
    });

    it("should mark cells", function () {
        expect(board.getIsMarked(1, 1)).toBe(false);
        board.mark(1, 1);
        expect(board.getIsMarked(1, 1)).toBe(true);
    });

    it("should not allow marking cells twice", function () {
        expect(board.getIsMarked(1, 1)).toBe(false);
        board.mark(1, 1);
        expect(function () { board.mark(1, 1) }).toThrow();
    });

    it("should throw when out of bounds", function () {
        expect(function() {board.getIsFilled(5, 5)}).toThrow();
        expect(function() {board.getIsFilled(-1, 5)}).toThrow();
        expect(function() {board.mark(5, 5)}).toThrow();
        expect(function() {board.mark(-1, 5)}).toThrow();
    });

    it("should return total filled cells amount", function () {
        expect(board.getTotalFilledCells()).toBe(12);
    });

    it("should return amount of correctly guessed cells", function () {
        expect(board.getGuessedCellsAmount()).toBe(0);
        board.mark(1, 0);
        board.mark(2, 4);
        expect(board.getGuessedCellsAmount()).toBe(2);
        board = new lowfat.Board(BOARD_PRESET_WIDTH, BOARD_PRESET_HEIGHT, BOARD_PRESET, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]);
        expect(board.getGuessedCellsAmount()).toBe(9);
    });

    it("should return groups in row", function () {
        var expectedRow0 = [1, 1];
        var expectedRow1 = [];
        var expectedRow2 = [4];
        var expectedRow3 = [3];
        var expectedRow4 = [1, 2];

        expect(board.getGroupsInRow(0)).toEqual(expectedRow0);
        expect(board.getGroupsInRow(1)).toEqual(expectedRow1);
        expect(board.getGroupsInRow(2)).toEqual(expectedRow2);
        expect(board.getGroupsInRow(3)).toEqual(expectedRow3);
        expect(board.getGroupsInRow(4)).toEqual(expectedRow4);
    });

    it("should return groups in col", function () {
        var expectedCol0 = [1, 1];
        var expectedCol1 = [1, 2];
        var expectedCol2 = [3];
        var expectedCol3 = [1, 3];

        expect(board.getGroupsInCol(0)).toEqual(expectedCol0);
        expect(board.getGroupsInCol(1)).toEqual(expectedCol1);
        expect(board.getGroupsInCol(2)).toEqual(expectedCol2);
        expect(board.getGroupsInCol(3)).toEqual(expectedCol3);
    });

    it("should return marked groups in row", function () {
        var expectedRow0 = [true, true];
        var expectedRow1 = [];
        var expectedRow2 = [false];
        var expectedRow3 = [true];
        var expectedRow4 = [false, true];

        board.mark(1, 0);
        board.mark(3, 0);
        board.mark(1, 1);
        board.mark(2, 1);
        board.mark(3, 1);
        board.mark(0, 2);
        board.mark(2, 2);
        board.mark(3, 2);
        board.mark(1, 3);
        board.mark(2, 3);
        board.mark(3, 3);
        board.mark(2, 4);
        board.mark(3, 4);

        expect(board.getMarkedGroupsInRow(0)).toEqual(expectedRow0);
        expect(board.getMarkedGroupsInRow(1)).toEqual(expectedRow1);
        expect(board.getMarkedGroupsInRow(2)).toEqual(expectedRow2);
        expect(board.getMarkedGroupsInRow(3)).toEqual(expectedRow3);
        expect(board.getMarkedGroupsInRow(4)).toEqual(expectedRow4);
    });

    it("should return marked groups in col", function () {
        var expectedCol0 = [true, true];
        var expectedCol1 = [true, false];
        var expectedCol2 = [false];
        var expectedCol3 = [false, false];

        board.mark(0, 2);
        board.mark(0, 4);
        board.mark(1, 0);
        board.mark(1, 1);
        board.mark(1, 3);
        board.mark(1, 4);
        board.mark(3, 1);
        board.mark(3, 3);
        board.mark(3, 4);

        expect(board.getMarkedGroupsInCol(0)).toEqual(expectedCol0);
        expect(board.getMarkedGroupsInCol(1)).toEqual(expectedCol1);
        expect(board.getMarkedGroupsInCol(2)).toEqual(expectedCol2);
        expect(board.getMarkedGroupsInCol(3)).toEqual(expectedCol3);
    });

    it("should find and return longest group among rows", function () {
        var expectedResult = 2;
        expect(board.getBiggestGroupsAmountInRows()).toEqual(expectedResult);
    });

    it("should find and return longest group among cols", function () {
            var expectedResult = 2;
            expect(board.getBiggestGroupsAmountInCols()).toEqual(expectedResult);
        });

    it("should init with marked cells array", function () {
        board = new lowfat.Board(2, 2, [1, 0, 0, 1], [1, 1, 1, 0]);
        expect(board.getIsMarked(1, 0)).toBe(true);
        expect(board.getIsMarked(1, 1)).toBe(false);

        board = new lowfat.Board(2, 2, [1, 0, 0, 1], []);
        expect(board.getIsMarked(1, 0)).toBe(false);
        expect(board.getIsMarked(1, 1)).toBe(false);

        board = new lowfat.Board(2, 2, [1, 0, 0, 1]);
        expect(board.getIsMarked(1, 0)).toBe(false);
        expect(board.getIsMarked(1, 1)).toBe(false);

        expect(function () {
            board = new lowfat.Board(2, 2, [1, 0, 0, 1], [1, 1, 1]);
        }).toThrow();
    });
});