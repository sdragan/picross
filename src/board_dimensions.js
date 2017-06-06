var lowfat = lowfat || {};

lowfat.BoardDimensions = function (screenSizeInPoints, cols, rows, biggestGroupsAmountInRows, biggestGroupsAmountInCols) {
    var screenWidthInPoints = screenSizeInPoints.width;
    var screenHeightInPoints = screenSizeInPoints.height;

    var DEFAULT_CELL_SIZE = 50;

    this.getCellSize = function () {
        return DEFAULT_CELL_SIZE;
    };

    this.getWidth = function () {
        return this.getCellSize() * cols;
    };

    this.getHeight = function () {
        return this.getCellSize() * rows;
    };

    this.getLeftX = function () {
        return (screenWidthInPoints - (this.getCellSize() * cols)) / 2;
    };

    this.getLeftmostCellX = function () {
        return this.getLeftX() + this.getCellSize() / 2;
    };

    this.getBottomY = function () {
        return (screenHeightInPoints - (this.getCellSize() * rows)) / 2;
    };

    this.getBottommostCellY = function () {
        return this.getBottomY() + this.getCellSize() / 2;
    };

    this.getRightX = function () {
        return this.getLeftX() + this.getWidth();
    };

    this.getTopY = function () {
        return this.getBottomY() + this.getHeight();
    };

    this.pointsToCellX = function (pointsX) {
        return Math.floor((pointsX - this.getLeftX()) / this.getCellSize());
    };

    this.pointsToCellY = function (pointsY) {
        return rows - Math.ceil((pointsY - this.getBottomY()) / this.getCellSize());
    };

    this.cellToPointsX = function (cellX) {
        return this.getLeftmostCellX() + cellX * this.getCellSize();
    };

    this.cellToPointsY = function (cellY) {
        return (this.getTopY() - this.getCellSize() / 2) - cellY * this.getCellSize();
    };

    this.resize = function (screenSizeInPoints) {
        screenWidthInPoints = screenSizeInPoints.width;
        screenHeightInPoints = screenSizeInPoints.height;
    };
};