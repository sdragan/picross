describe("Board Dimensions", function () {
    var boardDimensions;
    var BOARD_PRESET_WIDTH = 4;
    var BOARD_PRESET_HEIGHT = 5;
    var DEFAULT_CELL_SIZE = 50;
    var SCREEN_PRESET_WIDTH_IN_POINTS = 1000;
    var SCREEN_PRESET_HEIGHT_IN_POINTS = 720;

    var SCREEN_PRESET_WIDTH_IN_POINTS_2 = 2000;
    var SCREEN_PRESET_HEIGHT_IN_POINTS_2 = 360;

    beforeEach(function () {
        boardDimensions = new lowfat.BoardDimensions(BOARD_PRESET_WIDTH, BOARD_PRESET_HEIGHT, {
            width: SCREEN_PRESET_WIDTH_IN_POINTS, height: SCREEN_PRESET_HEIGHT_IN_POINTS
        });
    });

    it("should return cell size", function () {
        expect(boardDimensions.getCellSize()).toBe(DEFAULT_CELL_SIZE);
    });

    it("should return board width", function () {
        var expectedResult = DEFAULT_CELL_SIZE * BOARD_PRESET_WIDTH;
        expect(boardDimensions.getWidth()).toBe(expectedResult);
    });

    it("should return board height", function () {
        var expectedResult = DEFAULT_CELL_SIZE * BOARD_PRESET_HEIGHT;
        expect(boardDimensions.getHeight()).toBe(expectedResult);
    });

    it("should return board left x", function () {
        var expectedResult = 400;
        expect(boardDimensions.getLeftX()).toBe(expectedResult);
    });

    it("should return leftmost cell x", function () {
        var expectedResult = 400 + DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.getLeftmostCellX()).toBe(expectedResult);
    });

    it("should return board bottom y", function () {
        var expectedResult = 235;
        expect(boardDimensions.getBottomY()).toBe(expectedResult);
    });

    it("should return bottommost cell y", function () {
        var expectedResult = 235 + DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.getBottommostCellY()).toBe(expectedResult);
    });

    it("should return board top y", function () {
        var expectedResult = 235 + BOARD_PRESET_HEIGHT * DEFAULT_CELL_SIZE;
        expect(boardDimensions.getTopY()).toBe(expectedResult);
    });

    it("should return board right y", function () {
        var expectedResult = 400 + BOARD_PRESET_WIDTH * DEFAULT_CELL_SIZE;
        expect(boardDimensions.getRightX()).toBe(expectedResult);
    });

    it("should return points to cell coords", function () {
        var pointsX = 510;
        var expectedCellX = 2;
        expect(boardDimensions.pointsToCellX(pointsX)).toBe(expectedCellX);

        pointsX = 405;
        expectedCellX = 0;
        expect(boardDimensions.pointsToCellX(pointsX)).toBe(expectedCellX);

        var pointsY = 390;
        var expectedCellY = 1;
        expect(boardDimensions.pointsToCellY(pointsY)).toBe(expectedCellY);

        pointsY = 240;
        expectedCellY = 4;
        expect(boardDimensions.pointsToCellY(pointsY)).toBe(expectedCellY);
    });

    it("should return cell coords to points", function () {
        var cellX = 0;
        var expectedPointsX = 400 + DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.cellToPointsX(cellX)).toBe(expectedPointsX);

        cellX = 3;
        expectedPointsX = 550 + DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.cellToPointsX(cellX)).toBe(expectedPointsX);

        var cellY = 0;
        var expectedPointsY = 485 - DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.cellToPointsY(cellY)).toBe(expectedPointsY);

        cellY = 4;
        expectedPointsY = 285 - DEFAULT_CELL_SIZE / 2;
        expect(boardDimensions.cellToPointsY(cellY)).toBe(expectedPointsY);
    });

    it("should respond to screen size changes", function () {
        var expectedLeftXBeforeChange = 400;
        var expectedTopYBeforeChange = 485;
        var expectedCellSizeBeforeChange = 50;

        var expectedLeftXAfterChange = 900;
        var expectedTopYAfterChange = 305;
        var expectedCellSizeAfterChange = 50;

        expect(boardDimensions.getLeftX()).toBe(expectedLeftXBeforeChange);
        expect(boardDimensions.getTopY()).toBe(expectedTopYBeforeChange);
        expect(boardDimensions.getCellSize()).toBe(expectedCellSizeBeforeChange);

        boardDimensions.resize({width: SCREEN_PRESET_WIDTH_IN_POINTS_2, height: SCREEN_PRESET_HEIGHT_IN_POINTS_2});

        expect(boardDimensions.getLeftX()).toBe(expectedLeftXAfterChange);
        expect(boardDimensions.getTopY()).toBe(expectedTopYAfterChange);
        expect(boardDimensions.getCellSize()).toBe(expectedCellSizeAfterChange);
    });
});