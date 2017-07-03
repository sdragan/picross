var lowfat = lowfat || {};

lowfat.LevelThumbnail = function (spriteFactory, cols, rows, elementsArray) {
    var cellSize = 24;
    var bgSize = 48;
    var thumbnailNode = new cc.Node();

    init();

    function init() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackground", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);

        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                if (getIsFilled(col, row)) {
                    var filledCell = spriteFactory.getSprite("LevelThumbnailFilledCell");
                    filledCell.setPosition(cellSize / 2 + cellSize * col, cellSize * rows - cellSize * row - cellSize / 2);
                    thumbnailNode.addChild(filledCell);
                }
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

    return {
        addToParent: addToParent,
        setPosition: setPosition
    }
};