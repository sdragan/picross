var lowfat = lowfat || {};

lowfat.Gamefield = function (scene, spriteFactory) {
    var container = scene;
    var board = null;
    var boardDimensions = null;
    var groupLabelsRows = null;
    var groupLabelsCols = null;
    var gridCellSprites = null;
    var gridContentSprites = null;
    var controls = null;
    var livesLeft;
    var bgGradient = null;
    var boardContainer = null;

    function initVars() {
        // var smallBoard4x5 = new lowfat.Board(4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
        // var boardHeart10x10 = new lowfat.Board(10, 10, [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]);
        var boardGlass8x8 = new lowfat.Board(8, 8, [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1]);

        board = boardGlass8x8;
        var boardSizeVO = new lowfat.BoardSizeVO(50, 14, 18, 2, 2, 0, 0, 0, 1.5);
        boardDimensions = new lowfat.BoardDimensions(cc.director.getWinSize(), board.getWidth(), board.getHeight(), board.getBiggestGroupsAmountInRows(), board.getBiggestGroupsAmountInCols(), boardSizeVO);
        livesLeft = 3;
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
        controls.enable();
    }

    function drawBoard() {
        gridCellSprites = [];
        gridContentSprites = [];
        for (var row = 0; row < board.getHeight(); row++) {
            for (var col = 0; col < board.getWidth(); col++) {
                var gridCell = spriteFactory.getSprite("GridCell");
                gridCell.setPosition(boardDimensions.cellToPointsXLocal(col), boardDimensions.cellToPointsYLocal(row));
                boardContainer.addChild(gridCell);
                gridCellSprites.push(gridCell);

                // showCellContent(col, row, board.getIsFilled(col, row) ? "CellFilled" : "CellEmptySmall");
            }
        }
    }

    function drawLabels() {
        groupLabelsRows = [];
        groupLabelsCols = [];

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
        drawLabels();
    };

    function selectCell(cellX, cellY) {
        if (board.getIsMarked(cellX, cellY)) {
            if (!board.getIsFilled(cellX, cellY)) {
                controls.forceStopDrag();
            }
            return;
        }

        board.mark(cellX, cellY);
        if (board.getIsFilled(cellX, cellY)) {
            var newColStatus = board.getMarkedGroupsInCol(cellX);
            var newRowStatus = board.getMarkedGroupsInRow(cellY);
            revealRestOfColOrRowIfNecessary(cellX, cellY, newColStatus, newRowStatus);
            revealFilledCell(cellX, cellY);
        } else {
            revealMistake(cellX, cellY);
            controls.forceStopDrag();
            livesLeft--;
            if (livesLeft <= 0) {
                levelLost();
            }
        }
    }

    function levelLost() {
        controls.disable();
        startBoardClearAnimation();
    }

    function startBoardClearAnimation() {
        var totalDuration = 0.8;
        var gridContentLength = gridContentSprites.length;
        var partialDuration = totalDuration / gridContentLength;
        var scaleDownDuration = 0.1;
        for (var i = 0; i < gridContentLength; i++) {
            var cellContent = gridContentSprites[i];
            var delay = totalDuration - i * partialDuration;
            var delayAction = new cc.DelayTime(delay);
            var scaleDownAction = new cc.ScaleTo(scaleDownDuration, 0, 0);
            var disappearAction = new cc.CallFunc(cellContent.removeFromParent, cellContent);
            var sequenceAction = new cc.Sequence(delayAction, scaleDownAction, disappearAction);
            cellContent.runAction(sequenceAction);
        }
        boardContainer.runAction(new cc.Sequence(new cc.DelayTime(totalDuration), new cc.CallFunc(onBoardClearAnimationFinished)));
    }

    function onBoardClearAnimationFinished() {
        initVars();
        resetGroupLabels();
        controls.enable();
    }

    function resetGroupLabels() {
        var i;
        var u;
        for (i = 0; i < groupLabelsCols.length; i++) {
            for (u = 0; u < groupLabelsCols[i].length; u++) {
                groupLabelsCols[i][u].setOpacity(255);
                groupLabelsCols[i][u].setScale(1, 1);
            }
        }
        for (i = 0; i < groupLabelsRows.length; i++) {
            for (u = 0; u < groupLabelsRows[i].length; u++) {
                groupLabelsRows[i][u].setOpacity(255);
                groupLabelsRows[i][u].setScale(1, 1);
            }
        }
    }

    function revealFilledCell(cellX, cellY) {
        showCellContent(cellX, cellY, "CellFilled");
    }

    function revealMistake(cellX, cellY) {
        showCellContent(cellX, cellY, "CellMistake");
    }

    function revealEmptyCell(cellX, cellY, delay) {
        showCellContent(cellX, cellY, "CellEmptySmall", delay);
    }

    function showCellContent(cellX, cellY, spriteName, delay) {
        var cellContent = spriteFactory.getSprite(spriteName);
        cellContent.setPosition(boardDimensions.cellToPointsXLocal(cellX), boardDimensions.cellToPointsYLocal(cellY));
        boardContainer.addChild(cellContent);
        gridContentSprites.push(cellContent);
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

    function grayLabelOut(label) {
        var scale = 0.8;
        var opacity = 100;
        var duration = 0.2;
        label.runAction(new cc.ScaleTo(duration, scale, scale));
        label.setOpacity(opacity);
    }

    function revealRestOfColOrRowIfNecessary(cellX, cellY, newColStatus, newRowStatus) {
        var markedCellsCount = 0;
        var delay = 0.08;
        var i;

        if (allElementsOfArrayAreEqualTo(newColStatus, true)) {
            var row;
            if (cellY < board.getHeight() / 2) {
                for (row = 0; row < board.getHeight(); row++) {
                    revealEmptyCellIfNotMarked(cellX, row);
                }
            } else {
                for (row = board.getHeight() - 1; row >= 0; row--) {
                    revealEmptyCellIfNotMarked(cellX, row);
                }
            }
            for (i = 0; i < groupLabelsCols[cellX].length; i++) {
                grayLabelOut(groupLabelsCols[cellX][i]);
            }
        }

        markedCellsCount = 0;
        if (allElementsOfArrayAreEqualTo(newRowStatus, true)) {
            var col;
            if (cellX < board.getWidth() / 2) {
                for (col = 0; col < board.getWidth(); col++) {
                    revealEmptyCellIfNotMarked(col, cellY);
                }
            } else {
                for (col = board.getWidth() - 1; col >= 0; col--) {
                    revealEmptyCellIfNotMarked(col, cellY);
                }
            }
            for (i = 0; i < groupLabelsRows[cellY].length; i++) {
                grayLabelOut(groupLabelsRows[cellY][i]);
            }
        }

        function revealEmptyCellIfNotMarked(cX, cY) {
            if (!board.getIsMarked(cX, cY)) {
                revealEmptyCell(cX, cY, delay * markedCellsCount);
                board.mark(cX, cY);
                markedCellsCount++;
            }
        }
    }

    this.onResize = function (screenSizeInPoints) {
        boardDimensions.resize(screenSizeInPoints);
        bgGradient.setContentSize(screenSizeInPoints.width, screenSizeInPoints.height);
        boardContainer.setPositionX(boardDimensions.getContainerLeftX());
    };

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
    var enabled = false;
    var that = this;

    this.enable = function () {
        if (enabled) {
            throw new Error("Trying to enable controls, but they are already enabled");
        }
        enabled = true;
        addListeners();
    };

    this.disable = function () {
        if (!enabled) {
            throw new Error("Trying to disable controls, but they are already disabled");
        }
        enabled = false;
        removeListeners();
    };

    function addListeners() {
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
    }

    function removeListeners() {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    }

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
        if (!touchStarted) {
            return;
        }

        if (!boardDimensions.getIsInsideBoard(touchX, touchY)) {
            that.forceStopDrag();
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