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
        var thumbnail = lowfat.LevelThumbnail(spriteFactory, 4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
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

lowfat.LevelThumbnail = function (spriteFactory, cols, rows, elementsArray, isLocked) {
    var cellSize = 24;
    var bgSize = 48;
    var thumbnailNode = new cc.Node();

    if (typeof(isLocked) === "undefined" || !isLocked) {
        drawUnlocked();
    } else {
        drawLocked();
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

    return {
        addToParent: addToParent,
        setPosition: setPosition,
        getWidth: getWidth,
        getHeight: getHeight
    }
};