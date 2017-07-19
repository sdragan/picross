var lowfat = lowfat || {};

lowfat.LevelSelectMenu = function (container, spriteFactory, gameStateModel, levelsModel, screenSize) {
    var thumbnailsContainer = null;
    var screenSizeInPoints = screenSize;
    var bgGradient = null;

    function initLayers() {
        bgGradient = new cc.LayerGradient(cc.color(161, 224, 229), cc.color(76, 161, 175));
        container.addChild(bgGradient);

        thumbnailsContainer = new cc.Node();
        container.addChild(thumbnailsContainer);
    }

    function initThumbnails() {
        var levelName = "boardDog5x5";
        var boardInfo = levelsModel.getBoardInfoByLevelName(levelName);
        var levelState = gameStateModel.getLevelStateByLevelName(levelName);
        var thumbnail = lowfat.LevelThumbnail(spriteFactory, boardInfo, levelName, levelState);
        thumbnail.addToParent(thumbnailsContainer);
        thumbnail.setPosition(10, 10);
    }

    function start(levelName) {
        initLayers();
        initThumbnails();
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;

    }

    return {
        start: start,
        onResize: onResize
    }
};

lowfat.LevelThumbnail = function (spriteFactory, boardInfo, levelName, state) {
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

    function drawAvailableButNotWon() {

    }

    function addToParent(parent) {
        parent.addChild(thumbnailNode);
    }

    function setPosition(x, y) {
        thumbnailNode.setPosition(x, y);
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
            console.log("Selected level " + levelName);
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
        setPosition: setPosition,
        getWidth: getWidth,
        getHeight: getHeight,
        processMouseMove: processMouseMove,
        processMouseClick: processMouseClick
    }
};