xdescribe("Board Dimensions", function () {
    var boardDimensions;
    var BOARD_WIDTH = 4;
    var BOARD_HEIGHT = 5;
    var CELL_SIZE = 50;
    var LABEL_WIDTH = 25;
    var LABEL_HEIGHT = 30;
    var MARGIN_TOP = 10;
    var MARGIN_BOTTOM = 200;
    var MARGIN_HORIZONTAL = 0;
    var MAX_SCALE = 1;

    var SCREEN_WIDTH_IN_POINTS = 1000;
    var SCREEN_HEIGHT_IN_POINTS = 720;
    var SCREEN_WIDTH_IN_POINTS_2 = 2000;
    var SCREEN_HEIGHT_IN_POINTS_2 = 360;

    var MAX_GROUP_LENGTH_COLS = 2;
    var MAX_GROUP_LENGTH_ROWS = 2;

    beforeEach(function () {
        var boardSizeVO = new lowfat.BoardSizeVO(CELL_SIZE, LABEL_WIDTH, LABEL_HEIGHT, MARGIN_TOP, MARGIN_BOTTOM, MARGIN_HORIZONTAL, MAX_SCALE);
        boardDimensions = new lowfat.BoardDimensions({
            width: SCREEN_WIDTH_IN_POINTS,
            height: SCREEN_HEIGHT_IN_POINTS
        }, BOARD_WIDTH, BOARD_HEIGHT, MAX_GROUP_LENGTH_ROWS, MAX_GROUP_LENGTH_COLS, boardSizeVO);
    });

    it("should return container coords", function () {
        expect(boardDimensions.getContainerBottomY()).toBe();
    });

});