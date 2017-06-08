var lowfat = lowfat || {};

lowfat.Gamefield = function (scene, spriteFactory) {
    var that = this;
    var container = scene;
    var board = null;
    var boardDimensions = null;
    var groupLabelsRows = null;
    var groupLabelsCols = null;
    var controls = null;

    var bgGradient = null;
    var boardContainer = null;

    function initVars() {
        var nonogram = [
            1, 1, 1, 0, 0, 1, 0, 0, 1, 1,
            1, 1, 0, 0, 0, 0, 0, 1, 0, 1,
            1, 1, 0, 0, 0, 0, 0, 1, 0, 1,
            1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 0, 0, 0, 0, 0, 1, 1,
            1, 1, 1, 1, 0, 0, 0, 1, 1, 1,
            0, 1, 0, 1, 1, 0, 1, 1, 1, 1,
            1, 0, 1, 1, 1, 1, 1, 0, 1, 0,
            0, 1, 0, 1, 1, 1, 1, 1, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 0, 1, 0
        ];

        board = new lowfat.Board(10, 10, nonogram);
        // board = new lowfat.Board(4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
        var boardSizeVO = new lowfat.BoardSizeVO(50, 14, 18, 2, 2, 0, 0, 0, 1.5);
        boardDimensions = new lowfat.BoardDimensions(cc.director.getWinSize(), board.getWidth(), board.getHeight(), board.getBiggestGroupsAmountInRows(), board.getBiggestGroupsAmountInCols(), boardSizeVO);
        groupLabelsRows = [];
        groupLabelsCols = [];
    }

    function initLayers() {
        bgGradient = new cc.LayerGradient(cc.color(161, 224, 229), cc.color(76, 161, 175));
        container.addChild(bgGradient);
        boardContainer = new cc.Node();
        container.addChild(boardContainer);
        boardContainer.setPosition(boardDimensions.getContainerLeftX(), boardDimensions.getContainerBottomY());
        boardContainer.setScale(boardDimensions.getScale(), boardDimensions.getScale());
    }

    function initControls() {
        controls = new lowfat.TouchControls(scene, boardDimensions, selectCell);
        controls.init();
    }

    function drawBoard() {
        for (var row = 0; row < board.getHeight(); row++) {
            for (var col = 0; col < board.getWidth(); col++) {
                var gridCell = spriteFactory.getSprite("GridCell");
                gridCell.setPosition(boardDimensions.cellToPointsXLocal(col), boardDimensions.cellToPointsYLocal(row));
                boardContainer.addChild(gridCell);

                // var cellContent = board.getIsFilled(col, row) ? spriteFactory.getSprite("CellFilled") : spriteFactory.getSprite("CellEmptySmall");
                // cellContent.setPosition(boardDimensions.cellToPointsXLocal(col), boardDimensions.cellToPointsYLocal(row));
                // boardContainer.addChild(cellContent);
            }
        }
    }

    function drawMarks() {
        var groupsCount;
        var groups;
        var labelsInLine;
        var label;
        var i;

        for (var row = 0; row < board.getHeight(); row++) {
            groups = board.getGroupsInRow(row);
            groupsCount = groups.length;
            labelsInLine = [];
            for (i = 0; i < groupsCount; i++) {
                label = spriteFactory.getSprite("GroupLabel" + groups[i]);
                label.setPosition(boardDimensions.labelRowToPointsXLocal(i, groupsCount), boardDimensions.labelRowToPointsYLocal(row));
                boardContainer.addChild(label);
                labelsInLine.push(label);
            }
            groupLabelsRows[row] = labelsInLine;
        }

        for (var col = 0; col < board.getWidth(); col++) {
            groups = board.getGroupsInCol(col);
            groupsCount = groups.length;
            labelsInLine = [];
            for (i = 0; i < groupsCount; i++) {
                label = spriteFactory.getSprite("GroupLabel" + groups[i]);
                label.setPosition(boardDimensions.labelColToPointsXLocal(col), boardDimensions.labelColToPointsYLocal(i, groupsCount));
                boardContainer.addChild(label);
                labelsInLine.push(label);
            }
            groupLabelsCols[col] = labelsInLine;
        }
    }

    this.start = function () {
        initVars();
        initLayers();
        initControls();
        drawBoard();
        drawMarks();
    };

    function selectCell(cellX, cellY) {
        if (board.getIsMarked(cellX, cellY)) {
            if (!board.getIsFilled(cellX, cellY)) {
                controls.forceStopDrag();
            }
            return;
        }

        if (board.getIsFilled(cellX, cellY)) {
            var oldColStatus = board.getMarkedGroupsInCol(cellX);
            var oldRowStatus = board.getMarkedGroupsInRow(cellY);
            board.mark(cellX, cellY);
            var newColStatus = board.getMarkedGroupsInCol(cellX);
            var newRowStatus = board.getMarkedGroupsInRow(cellY);
            updateLabelsIfNecessary(cellX, cellY, oldColStatus, oldRowStatus, newColStatus, newRowStatus);
            revealRestOfColOrRowIfNecessary(cellX, cellY, newColStatus, newRowStatus);
            revealFilledCell(cellX, cellY);
        } else {
            board.mark(cellX, cellY);
            revealMistake(cellX, cellY);
            controls.forceStopDrag();
        }
    }

    function revealFilledCell(cellX, cellY) {
        var cellContent = spriteFactory.getSprite("CellFilled");
        cellContent.setPosition(boardDimensions.cellToPointsXLocal(cellX), boardDimensions.cellToPointsYLocal(cellY));
        boardContainer.addChild(cellContent);

        var upScaleAction = new cc.ScaleTo(0.1, 1.1, 1.1).easing(cc.easeCubicActionOut());
        var waitAction = new cc.DelayTime(0.15);
        var scaleDownAction = new cc.ScaleTo(0.25, 1, 1).easing(cc.easeQuadraticActionOut());
        var sequence = new cc.Sequence(upScaleAction, waitAction, scaleDownAction);
        cellContent.runAction(sequence);
    }

    function revealMistake(cellX, cellY) {
        var cellContent = spriteFactory.getSprite("CellMistake");
        cellContent.setPosition(boardDimensions.cellToPointsXLocal(cellX), boardDimensions.cellToPointsYLocal(cellY));
        boardContainer.addChild(cellContent);

        var upScaleAction = new cc.ScaleTo(0.1, 1.1, 1.1).easing(cc.easeCubicActionOut());
        var waitAction = new cc.DelayTime(0.15);
        var scaleDownAction = new cc.ScaleTo(0.25, 1, 1).easing(cc.easeQuadraticActionOut());
        var sequence = new cc.Sequence(upScaleAction, waitAction, scaleDownAction);
        cellContent.runAction(sequence);
    }

    function revealEmptyCell(cellX, cellY, delay) {
        var cellContent = spriteFactory.getSprite("CellEmptySmall");
        cellContent.setPosition(boardDimensions.cellToPointsXLocal(cellX), boardDimensions.cellToPointsYLocal(cellY));
        boardContainer.addChild(cellContent);
        cellContent.setScale(0, 0);
        var upScaleAction = new cc.ScaleTo(0.1, 1.1, 1.1).easing(cc.easeCubicActionOut());
        var waitAction = new cc.DelayTime(0.15);
        var scaleDownAction = new cc.ScaleTo(0.25, 1, 1).easing(cc.easeQuadraticActionOut());
        var sequence;
        if (typeof delay != "undefined" && delay != null) {
            var delayAction = new cc.DelayTime(delay);
            sequence = new cc.Sequence(delayAction, upScaleAction, waitAction, scaleDownAction);
        } else {
            sequence = new cc.Sequence(upScaleAction, waitAction, scaleDownAction);
        }
        cellContent.runAction(sequence);
    }

    function updateLabelsIfNecessary(cellX, cellY, oldColsStatus, oldRowsStatus, newColsStatus, newRowsStatus) {
        var colChangeIndex = getIndexOfDifferentElement(oldColsStatus, newColsStatus);
        var rowChangeIndex = getIndexOfDifferentElement(oldRowsStatus, newRowsStatus);

        if (colChangeIndex == -1 && rowChangeIndex == -1) {
            return;
        }

        var label;
        var scale = 0.8;
        var opacity = 100;
        var duration = 0.2;
        if (colChangeIndex >= 0) {
            label = groupLabelsCols[cellX][colChangeIndex];
            label.runAction(new cc.ScaleTo(duration, scale, scale));
            label.setOpacity(opacity);
        }
        if (rowChangeIndex >= 0) {
            label = groupLabelsRows[cellY][rowChangeIndex];
            label.runAction(new cc.ScaleTo(duration, scale, scale));
            label.setOpacity(opacity);
        }
    }

    function revealRestOfColOrRowIfNecessary(cellX, cellY, newColStatus, newRowStatus) {
        var markedCellsCount = 0;
        var delay = 0.1;

        if (allElementsOfArrayAreEqualTo(newColStatus, true)) {
            for (var row = 0; row < board.getWidth(); row++) {
                if (!board.getIsMarked(cellX, row)) {
                    revealEmptyCell(cellX, row, delay * markedCellsCount);
                    board.mark(cellX, row);
                    markedCellsCount++;
                }
            }
        }

        markedCellsCount = 0;

        if (allElementsOfArrayAreEqualTo(newRowStatus, true)) {
            for (var col = 0; col < board.getWidth(); col++) {
                if (!board.getIsMarked(col, cellY)) {
                    revealEmptyCell(col, cellY, delay * markedCellsCount);
                    board.mark(col, cellY);
                    markedCellsCount++;
                }
            }
        }
    }

    this.onResize = function (screenSizeInPoints) {
        boardDimensions.resize(screenSizeInPoints);
        bgGradient.setContentSize(screenSizeInPoints.width, screenSizeInPoints.height);
        boardContainer.setPositionX(boardDimensions.getContainerLeftX());
    };

    function getIndexOfDifferentElement(arrA, arrB) {
        if (arrA.length != arrB.length) {
            throw new Error("Arrays of different length provided")
        }
        for (var i = 0; i < arrA.length; i++) {
            if (arrA[i] != arrB[i]) {
                return i;
            }
        }
        return -1;
    }

    function allElementsOfArrayAreEqualTo(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != value) {
                return false;
            }
        }
        return true;
    }
};

lowfat.TouchControls = function (scene, boardDimensions, selectCellCallback) {
    var touchStarted = false;

    this.init = function () {
        this.addListeners();
    };

    this.addListeners = function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                processTouchStarted(touch.getLocation().x, touch.getLocation().y);
                return true;
            },
            onTouchMoved: function (touch, event) {
                processTouchUpdated(touch.getLocation().x, touch.getLocation().y, touch.getDelta())
            },
            onTouchEnded: function (touch, event) {
                processTouchEnded(touch.getLocation().x, touch.getLocation().y);
            }
        }, scene);
    };

    this.removeListeners = function () {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    };

    this.forceStopDrag = function () {
        touchStarted = false;
    };

    function processTouchStarted(touchX, touchY) {
        if (!boardDimensions.getIsInsideBoard(touchX, touchY)) {
            return;
        }

        touchStarted = true;
        selectCellCallback(boardDimensions.pointsToCellX(touchX), boardDimensions.pointsToCellY(touchY));
    }

    function processTouchUpdated(touchX, touchY, delta) {
        if (!touchStarted || !boardDimensions.getIsInsideBoard(touchX, touchY)) {
            return;
        }

        selectCellCallback(boardDimensions.pointsToCellX(touchX), boardDimensions.pointsToCellY(touchY));
    }

    function processTouchEnded(touchX, touchY) {
        if (!touchStarted) {
            return;
        }

        touchStarted = false;
    }
};