var lowfat = lowfat || {};

lowfat.BoardSizeVO = function (cellSize, groupLabelWidth, groupLabelHeight, marginTop, marginBottom, marginHorizontal, maxScale) {
    this.cellSize = cellSize;
    this.groupLabelWidth = groupLabelWidth;
    this.groupLabelHeight = groupLabelHeight;
    this.marginTop = marginTop;
    this.marginBottom = marginBottom;
    this.marginHorizontal = marginHorizontal;
    this.maxScale = maxScale;
}

lowfat.BoardDimensions = function (screenSizeInPoints, cols, rows, biggestGroupsAmountInRows, biggestGroupsAmountInCols, boardSizeVO) {
    var screenWidthInPoints;
    var screenHeightInPoints;
    var scale;

    var DEFAULT_CELL_SIZE = 50;
    var GROUP_LABEL_WIDTH = 25;
    var GROUP_LABEL_HEIGHT = 30;
    var MARGIN_TOP = 0;
    var MARGIN_BOTTOM = 0;
    var MARGIN_HORIZONTAL = 0;
    var MAX_SCALE = 2;

    updateScreenSizeAndScale(screenSizeInPoints);

    this.cellToPointsX = function () {

    };

    this.cellToPointsY = function() {

    };



    this.resize = function (screenSizeInPoints) {
        updateScreenSizeAndScale(screenSizeInPoints);
    };

    function updateScreenSizeAndScale(screenSizeInPoints) {
        screenWidthInPoints = screenSizeInPoints.width;
        screenHeightInPoints = screenSizeInPoints.height;
        scale = getBiggestPossibleScale();
    }

    function getBiggestPossibleScale() {
        var cW = getContainerWidth();
        var cH = getContainerHeight();
        var w = this.getTotalWidthUnscaled();
        var h = this.getTotalHeightUnscaled();
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

    function getLabelsWidthUnscaled() {
        return biggestGroupsAmountInRows * GROUP_LABEL_WIDTH;
    }

    function getTotalHeightUnscaled() {
        return getBoardHeightUnscaled() + getLabelsHeightUnscaled();
    }

    function getBoardHeightUnscaled() {
        return getCellSizeUnscaled() * rows;
    }

    function getLabelsWidthUnscaled() {
        return biggestGroupsAmountInCols * GROUP_LABEL_HEIGHT;
    }

    function getCellSizeUnscaled() {
        return DEFAULT_CELL_SIZE;
    }
};