var lowfat = lowfat || {};

lowfat.Gamefield = function (scene, spriteManager) {
    var that = this;
    var container = scene;
    var board = null;
    var boardDimensions = null;

    var gridContainer = null;

    function initVars() {
        board = new lowfat.Board(4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
        boardDimensions = new lowfat.BoardDimensions(board.getWidth(), board.getHeight(), cc.director.getWinSize());
    }

    function initLayers() {
        var bgGradient = new cc.LayerGradient(cc.color(161, 224, 229), cc.color(76, 161, 175));
        container.addChild(bgGradient);
        gridContainer = new cc.Node();
        container.addChild(gridContainer);
    }

    function buildBoard() {
        for (var row = 0; row < board.getHeight(); row++) {
            for (var col = 0; col < board.getWidth(); col++) {
                var gridCell = spriteManager.getSprite("GridCell");
                gridCell.setPosition(boardDimensions.cellXToPoints(col), boardDimensions.cellYToPoints(row));
                gridContainer.addChild(gridCell);

                // var cellContent = board.getIsFilled(col, row) ? spriteManager.getSprite("CellFilled") : spriteManager.getSprite("CellEmptySmall");
                // cellContent.setPosition(boardDimensions.cellXToPoints(col), boardDimensions.cellYToPoints(row));
                // gridContainer.addChild(cellContent);
            }
        }
    }

    this.start = function () {
        initVars();
        initLayers();
        buildBoard();
    };

    this.onResize = function (screenSizeInPoints) {
        boardDimensions.resize(screenSizeInPoints);
    }
};