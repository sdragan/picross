var lowfat = lowfat || {};

lowfat.BoardSizeVO = function (cellSize, groupLabelWidth, groupLabelHeight, marginTop, marginBottom, marginHorizontal, maxScale) {
    this.cellSize = cellSize;
    this.groupLabelWidth = groupLabelWidth;
    this.groupLabelHeight = groupLabelHeight;
    this.marginTop = marginTop;
    this.marginBottom = marginBottom;
    this.marginHorizontal = marginHorizontal;
    this.maxScale = maxScale;
};

lowfat.BoardDimensions = function (screenSizeInPoints, cols, rows, biggestGroupsAmountInRows, biggestGroupsAmountInCols, boardSizeVO) {
    var screenWidthInPoints;
    var screenHeightInPoints;
    var scale;

    var DEFAULT_CELL_SIZE = boardSizeVO.cellSize;
    var GROUP_LABEL_WIDTH = boardSizeVO.groupLabelWidth;
    var GROUP_LABEL_HEIGHT = boardSizeVO.groupLabelHeight;
    var MARGIN_TOP = boardSizeVO.marginTop;
    var MARGIN_BOTTOM = boardSizeVO.marginBottom;
    var MARGIN_HORIZONTAL = boardSizeVO.marginHorizontal;
    var MAX_SCALE = boardSizeVO.maxScale;

    updateScreenSizeAndScale(screenSizeInPoints);

    this.getScale = function () {
        return scale;
    };

    this.cellToPointsXLocal = function (cellX) {
        return getLabelsWidthUnscaled() + (cellX + 0.5) * getCellSizeUnscaled();
    };

    this.cellToPointsYLocal = function (cellY) {
        return (rows - cellY - 0.5) * getCellSizeUnscaled();
    };

    this.cellToPointsXGlobal = function (cellX) {
        return getBoardLeftXScaled() + ((cellX + 0.5) * getCellSizeScaled());
    };

    this.cellToPointsYGlobal = function (cellY) {
        return getBoardBottomYScaled() + (rows - cellY - 0.5) * getCellSizeScaled();
    };

    this.pointsToCellX = function (pointsX) {
        return Math.floor((pointsX - getBoardLeftXScaled()) / getCellSizeScaled())
    };

    this.pointsToCellY = function (pointsY) {
        return rows - Math.ceil((pointsY - getBoardBottomYScaled()) / getCellSizeScaled());
    };

    this.getContainerLeftX = function () {
        return getTotalLeftXScaled();
    };

    this.getContainerBottomY = function () {
        return getBoardBottomYScaled();
    };

    this.getIsInsideBoard = function (pointsX, pointsY) {
        return pointsX > getBoardLeftXScaled() && pointsX < getBoardRightXScaled() && pointsY > getBoardBottomYScaled() && pointsY < getBoardTopYScaled();
    };

    this.resize = function (screenSizeInPoints) {
        updateScreenSizeAndScale(screenSizeInPoints);
    };

    function getBoardHeightScaled() {
        return getBoardHeightUnscaled() * scale;
    }

    function getLabelsWidthScaled() {
        return getLabelsWidthUnscaled() * scale;
    }

    function getTotalLeftXScaled() {
        return MARGIN_HORIZONTAL + (getContainerWidth() - getTotalWidthScaled()) / 2;
    }

    function getTotalWidthScaled() {
        return getTotalWidthUnscaled() * scale;
    }

    function getTotalHeightScaled() {
        return getTotalHeightUnscaled() * scale;
    }

    function getBoardLeftXScaled() {
        return getTotalLeftXScaled() + getLabelsWidthScaled();
    }

    function getBoardRightXScaled() {
        return getTotalLeftXScaled() + getTotalWidthScaled();
    }

    function getBoardBottomYScaled() {
        return MARGIN_BOTTOM + (getContainerHeight() - getTotalHeightScaled()) / 2;
    }

    function getBoardTopYScaled() {
        return getBoardBottomYScaled() + getBoardHeightScaled();
    }

    function updateScreenSizeAndScale(screenSizeInPoints) {
        screenWidthInPoints = screenSizeInPoints.width;
        screenHeightInPoints = screenSizeInPoints.height;
        scale = getBiggestPossibleScale();
    }

    function getBiggestPossibleScale() {
        var cW = getContainerWidth();
        var cH = getContainerHeight();
        var w = getTotalWidthUnscaled();
        var h = getTotalHeightUnscaled();
        var dW = cW / w;
        var dH = cH / h;
        var resultScale = dW < dH ? dW : dH;
        if (resultScale > MAX_SCALE) {
            resultScale = MAX_SCALE;
        }
        return resultScale;
    }

    function getContainerWidth() {
        return screenWidthInPoints - MARGIN_HORIZONTAL * 2;
    }

    function getContainerHeight() {
        return screenHeightInPoints - MARGIN_TOP - MARGIN_BOTTOM;
    }

    function getTotalWidthUnscaled() {
        return getBoardWidthUnscaled() + getLabelsWidthUnscaled();
    }

    function getBoardWidthUnscaled() {
        return getCellSizeUnscaled() * cols;
    }

    function getTotalHeightUnscaled() {
        return getBoardHeightUnscaled() + getLabelsHeightUnscaled();
    }

    function getBoardHeightUnscaled() {
        return getCellSizeUnscaled() * rows;
    }

    function getLabelsWidthUnscaled() {
        return biggestGroupsAmountInRows * GROUP_LABEL_WIDTH;
    }

    function getLabelsHeightUnscaled() {
        return biggestGroupsAmountInCols * GROUP_LABEL_HEIGHT;
    }

    function getCellSizeUnscaled() {
        return DEFAULT_CELL_SIZE;
    }

    function getCellSizeScaled() {
        return getCellSizeUnscaled() * scale;
    }
};