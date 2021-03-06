var lowfat = lowfat || {};

lowfat.Gamefield = function (scene, spriteFactory, gameStateModel, screenSize, returnToLevelSelectCallback, returnToLevelSelectCallbackContext) {
    var container = scene;
    var levelName = null;
    var boardInfo = null;
    var board = null;
    var boardDimensions = null;
    var groupLabelsRows = null;
    var groupLabelsCols = null;
    var gridCellSprites = null;
    var gridContentSprites = null;
    var controls = null;
    var livesLeft;
    var boardContainer = null;
    var uiContainer = null;
    var menuContainer = null;
    var livesPanel = null;
    var screenSizeInPoints = screenSize;

    function initVars(levelNameParam, boardInfoParam, initialMarkedCells, initialMistakenlyMarkedCellsIndexes, initialLivesLeft) {
        levelName = levelNameParam;
        boardInfo = boardInfoParam;
        board = lowfat.Board(boardInfo.getCols(), boardInfo.getRows(), boardInfo.getElementsArray(), initialMarkedCells, initialMistakenlyMarkedCellsIndexes);
        livesLeft = initialLivesLeft;
        var boardSizeVO = new lowfat.BoardSizeVO(50, 14, 18, 2, 2, 0, 0, 0, 1.5);
        boardDimensions = new lowfat.BoardDimensions(screenSizeInPoints, board.getWidth(), board.getHeight(), board.getBiggestGroupsAmountInRows(), board.getBiggestGroupsAmountInCols(), boardSizeVO);
    }

    function initLayers() {
        boardContainer = new cc.Node();
        container.addChild(boardContainer);
        boardContainer.setPosition(boardDimensions.getContainerLeftX(), boardDimensions.getContainerBottomY());
        boardContainer.setScale(boardDimensions.getScale(), boardDimensions.getScale());
        boardContainer.setCascadeColorEnabled(true);
        boardContainer.setCascadeOpacityEnabled(true);
        menuContainer = new cc.Node();
        container.addChild(menuContainer);
        uiContainer = new cc.Node();
        container.addChild(uiContainer);
        livesPanel = lowfat.LivesPanel(uiContainer, screenSizeInPoints, spriteFactory);
        livesPanel.setInitialLives(livesLeft);
    }

    function initControls() {
        controls = lowfat.TouchControls(scene, boardDimensions, selectCell);
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

                if (board.getIsMarked(col, row)) {
                    if (board.getIsFilled(col, row)) {
                        revealFilledCell(col, row);
                    } else {
                        if (board.getIsMistakenlyMarked(col, row)) {
                            revealMistake(col, row);
                        } else {
                            revealEmptyCell(col, row);
                        }
                    }
                }
            }
        }
    }

    function drawLabels() {
        groupLabelsRows = [];
        groupLabelsCols = [];

        board.getIsFilled();

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

    function resetBoardAndLives() {
        board = lowfat.Board(boardInfo.getCols(), boardInfo.getRows(), boardInfo.getElementsArray());
        livesLeft = 3;
    }

    function resetLabels() {
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

    function start(levelNameParam, boardInfoParam, initialMarkedCells, initialMistakenlyMarkedCellsIndexes, initialLivesLeft) {
        initVars(levelNameParam, boardInfoParam, initialMarkedCells, initialMistakenlyMarkedCellsIndexes, initialLivesLeft);
        initLayers();
        initControls();
        drawBoard();
        drawLabels();
    }

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
            if (board.getIsSolved()) {
                levelWon();
            }
        } else {
            revealMistake(cellX, cellY);
            controls.forceStopDrag();
            livesLeft--;
            livesPanel.decrementLife();
            if (livesLeft <= 0) {
                levelLost();
            }
        }

        if (livesLeft > 0 && !board.getIsSolved()) {
            gameStateModel.saveFromBoard(levelName, board.getMarkedCells(), board.getMistakenlyMarkedCells(), livesLeft)
        } else {
            gameStateModel.saveFromLevelSelect();
        }
    }

    function levelLost() {
        controls.disable();
        grayBoardOut(onGrayBoardOutFinished);
    }

    function levelWon() {
        controls.disable();
        if (gameStateModel.getLevelStateByLevelName(levelName) < livesLeft) {
            gameStateModel.setLevelStatus(levelName, livesLeft);
        }
        playShortLevelWonAnimation(onShortLevelWonAnimationFinished);
    }

    function restartLevelDuringPlay() {
        controls.disable();
        playBoardClearAnimation(resetLevel);
    }

    function restartLevelAfterLost() {
        ungrayBoardOut();
        playBoardClearAnimation(resetLevel);
    }

    function restartLevelAfterWin() {
        playBoardClearAnimation(resetLevel);
    }

    function resetLevel() {
        resetBoardAndLives();
        resetLabels();
        livesPanel.setInitialLives(3);
        controls.enable();
    }

    function playBoardClearAnimation(finishedCallback) {
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
        boardContainer.runAction(new cc.Sequence(new cc.DelayTime(totalDuration), new cc.CallFunc(finishedCallback)));
    }

    function grayBoardOut(finishedCallback) {
        var duration = 1.5;
        boardContainer.stopAllActions();
        var boardFadeSpawn = new cc.Spawn(new cc.FadeTo(duration, 150), new cc.TintTo(duration, 100, 100, 100));
        var callFuncAction = new cc.CallFunc(finishedCallback);
        boardContainer.runAction(new cc.Sequence(boardFadeSpawn, callFuncAction));
    }

    function onGrayBoardOutFinished() {
        displayLevelLostMenu();
    }

    function displayLevelLostMenu() {
        var postLevelMenu = lowfat.PostLevelLostMenu(menuContainer, screenSizeInPoints, spriteFactory, restartLevelAfterLost, backToMenuAfterLevelLost);
        postLevelMenu.show();
    }

    function ungrayBoardOut() {
        var duration = 1.5;
        boardContainer.stopAllActions();
        var boardUnfadeSpawn = new cc.Spawn(new cc.FadeTo(duration, 255), new cc.TintTo(duration, 255, 255, 255));
        boardContainer.runAction(boardUnfadeSpawn);
    }

    function playExitLevelAnimation(finishedCallback) {
        var totalDuration = 0.5;
        boardContainer.stopAllActions();
        boardContainer.runAction(new cc.Sequence(new cc.FadeOut(totalDuration), new cc.CallFunc(finishedCallback)));
    }

    function onExitLevelAnimationFinished() {
        var i;
        for (i = 0; i < gridContentSprites.length; i++) {
            gridContentSprites[i].removeFromParent();
        }
        for (i = 0; i < gridCellSprites.length; i++) {
            gridCellSprites[i].removeFromParent();
        }

        var u;
        for (i = 0; i < groupLabelsCols.length; i++) {
            for (u = 0; u < groupLabelsCols[i].length; u++) {
                groupLabelsCols[i][u].removeFromParent();
            }
        }
        for (i = 0; i < groupLabelsRows.length; i++) {
            for (u = 0; u < groupLabelsRows[i].length; u++) {
                groupLabelsRows[i][u].removeFromParent();
            }
        }
        livesPanel.clear();
        boardContainer.setOpacity(255);
    }

    function playShortLevelWonAnimation(finishedCallback) {
        boardContainer.runAction(new cc.Sequence(new cc.DelayTime(0.8), new cc.CallFunc(playShortLevelWonAnimationStep2, null, finishedCallback)));
    }

    function playShortLevelWonAnimationStep2(target, finishedCallback) {
        var gridContentLength = gridContentSprites.length;
        for (var i = 0; i < gridContentLength; i++) {
            var upScaleAction = new cc.ScaleTo(0.1, 1.05, 1.05).easing(cc.easeCubicActionOut());
            var waitAction = new cc.DelayTime(0.15);
            var scaleDownAction = new cc.ScaleTo(0.25, 1, 1).easing(cc.easeQuadraticActionOut());
            var sequence = new cc.Sequence(upScaleAction, waitAction, scaleDownAction);
            gridContentSprites[i].runAction(sequence);
        }
        boardContainer.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.CallFunc(finishedCallback)));
    }

    function onShortLevelWonAnimationFinished() {
        var postLevelMenu = lowfat.PostLevelWinMenu(menuContainer, screenSizeInPoints, spriteFactory, livesLeft, restartLevelAfterWin, backToMenuAfterLevelWin);
        postLevelMenu.show();
    }

    function backToMenuAfterLevelWin() {
        onExitLevelAnimationFinished();
        returnToLevelSelectCallback.call(returnToLevelSelectCallbackContext, levelName)
    }

    function backToMenuAfterLevelLost() {
        onExitLevelAnimationFinished();
        returnToLevelSelectCallback.call(returnToLevelSelectCallbackContext);
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
        if (typeof delay != "undefined" && delay) {
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
                board.mark(cX, cY, true);
                markedCellsCount++;
            }
        }
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;
        boardDimensions.resize(screenSizeInPoints);
        boardContainer.setPositionX(boardDimensions.getContainerLeftX());
        livesPanel.onResize(screenSize);
    }

    function allElementsOfArrayAreEqualTo(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != value) {
                return false;
            }
        }
        return true;
    }

    function update(dt) {

    }

    return {
        start: start,
        update: update,
        onResize: onResize
    }
};

lowfat.TouchControls = function (scene, boardDimensions, selectCellCallback) {
    var touchStarted = false;
    var enabled = false;

    function enable() {
        if (enabled) {
            throw new Error("Trying to enable controls, but they are already enabled");
        }
        enabled = true;
        addListeners();
    }

    function disable() {
        if (!enabled) {
            throw new Error("Trying to disable controls, but they are already disabled");
        }
        enabled = false;
        removeListeners();
    }

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

    function forceStopDrag() {
        touchStarted = false;
    }

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
            forceStopDrag();
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

    return {
        enable: enable,
        disable: disable,
        forceStopDrag: forceStopDrag
    }
};