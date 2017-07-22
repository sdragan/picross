var lowfat = lowfat || {};

lowfat.LevelSelectMenu = function (container, spriteFactory, gameStateModel, levelsModel, startBoardCallback, startBoardContext, screenSize) {
    var screenSizeInPoints = screenSize;
    var thumbnailsContainer = null;
    var bgGradient = null;
    var touchControls = null;
    var thumbnails = null;

    function initLayers() {
        bgGradient = new cc.LayerGradient(cc.color(161, 224, 229), cc.color(76, 161, 175));
        container.addChild(bgGradient);

        thumbnailsContainer = new cc.Node();
        container.addChild(thumbnailsContainer);
    }

    function initThumbnails() {
        thumbnails = [];
        var levelList = levelsModel.getLevelList();
        for (var i = 0; i < levelList.length; i++) {
            var levelName = levelList[i];
            var boardInfo = levelsModel.getBoardInfoByLevelName(levelName);
            var levelState = gameStateModel.getLevelStateByLevelName(levelName);
            var thumbnail = lowfat.LevelThumbnail(spriteFactory, boardInfo, levelName, levelState, processLevelSelected);
            var prevThumbnailY = i > 0 ? thumbnails[i - 1].getPositionY() + thumbnails[i - 1].getHeight() + 10 : 10;
            thumbnail.addToParent(thumbnailsContainer);
            thumbnail.setPosition((screenSizeInPoints.width - thumbnail.getWidth()) / 2, prevThumbnailY);
            thumbnails.push(thumbnail);
        }
    }

    function initControls() {
        touchControls = lowfat.LevelSelectTouchControls(container, null, processTouchDown);
        touchControls.enable();
    }

    function start(levelName) {
        // levelName передается, чтобы подсветить только что пройденный уровень
        initLayers();
        initThumbnails();
        initControls();
        gameStateModel.saveFromLevelSelect();
    }

    function processTouchDown(eventX, eventY) {
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].processMouseClick(eventX, eventY);
        }
    }

    function processLevelSelected(levelName) {
        if (gameStateModel.getLevelStateByLevelName(levelName) < 0) {
            return;
        }

        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].removeFromParent();
        }
        bgGradient.removeFromParent();
        touchControls.disable();
        startBoardCallback.call(startBoardContext, levelName, [], [], 3);
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;

    }

    return {
        start: start,
        onResize: onResize
    }
};

lowfat.LevelThumbnail = function (spriteFactory, boardInfo, levelName, state, selectedCallback) {
    var cellSize = 24;
    var bgSize = 48;

    var cols = boardInfo.getCols();
    var rows = boardInfo.getRows();
    var elementsArray = boardInfo.getElementsArray();

    var thumbnailNode = new cc.Node();
    var isMouseOver = false;

    if (state > 0) {
        drawUnlocked();
    } else if (state < 0) {
        drawLocked();
    } else {
        drawAvailableButNotWon();
    }

    function drawLocked() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackgroundLocked", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);
        var lockIcon = spriteFactory.getSprite("LevelThumbnailLockIcon");
        lockIcon.setPosition(getWidth() / 2, getHeight() / 2);
        thumbnailNode.addChild(lockIcon);
    }

    function drawAvailableButNotWon() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackground", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);
        var lockIcon = spriteFactory.getSprite("LevelThumbnailQuestionMarkIcon");
        lockIcon.setPosition(getWidth() / 2, getHeight() / 2);
        thumbnailNode.addChild(lockIcon);
    }

    function drawUnlocked() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackground", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);

        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                var spriteName = getIsFilled(col, row) ? "LevelThumbnailFilledCell" : "LevelThumbnailEmptyCell";
                var cellContent = spriteFactory.getSprite(spriteName);
                cellContent.setPosition(cellSize / 2 + cellSize * col, cellSize * rows - cellSize * row - cellSize / 2);
                thumbnailNode.addChild(cellContent);
            }
        }
    }

    function addToParent(parent) {
        parent.addChild(thumbnailNode);
    }

    function removeFromParent() {
        thumbnailNode.removeFromParent();
    }

    function setPosition(x, y) {
        thumbnailNode.setPosition(x, y);
    }

    function getPositionX() {
        return thumbnailNode.getPositionX();
    }

    function getPositionY() {
        return thumbnailNode.getPositionY();
    }

    function getIsFilled(x, y) {
        return elementsArray[y * cols + x] == 1;
    }

    function getWidth() {
        return cols * cellSize;
    }

    function getHeight() {
        return rows * cellSize;
    }

    function processMouseMove(eventX, eventY) {
        if (eventHitsNode(eventX, eventY)) {
            if (!isMouseOver) {

            }
        } else {
            if (isMouseOver) {

            }
        }
    }

    function processMouseClick(eventX, eventY) {
        if (eventHitsNode(eventX, eventY)) {
            selectedCallback(levelName);
        }
    }

    function eventHitsNode(eventX, eventY) {
        if (eventX > thumbnailNode.getPositionX() && eventX < thumbnailNode.getPositionX() + cols * cellSize) {
            if (eventY > thumbnailNode.getPositionY() && eventY < thumbnailNode.getPositionY() + rows * cellSize) {
                return true;
            }
        }
        return false;
    }

    return {
        addToParent: addToParent,
        removeFromParent: removeFromParent,
        setPosition: setPosition,
        getPositionX: getPositionX,
        getPositionY: getPositionY,
        getWidth: getWidth,
        getHeight: getHeight,
        processMouseMove: processMouseMove,
        processMouseClick: processMouseClick
    }
};

lowfat.LevelSelectTouchControls = function (scene, moveCallback, downCallback) {
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
        touchStarted = true;
        downCallback(touchX, touchY);
    }

    function processTouchUpdated(touchX, touchY, delta) {
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