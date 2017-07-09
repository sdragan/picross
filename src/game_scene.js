var lowfat = lowfat || {};

var GameScene = cc.Scene.extend({
    gamefield: null,
    gameStateModel: null,

    setup: function () {
        this.gameStateModel = lowfat.GameStateModel();
        this.gameStateModel.init(this.startBoard, this.startLevelSelect, this);
    },

    startBoard: function (levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        var smallBoard4x5 = lowfat.BoardInfo(4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
        var boardDog5x5 = lowfat.BoardInfo(5, 5, [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0]);
        var boardGlass8x8 = lowfat.BoardInfo(8, 8, [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1]);
        var boardHeart10x10 = lowfat.BoardInfo(10, 10, [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]);

        var boardInfo;
        if (levelName == "smallBoard4x5") {
            boardInfo = smallBoard4x5;
        } else if (levelName == "boardDog5x5") {
            boardInfo = boardDog5x5;
        } else if (levelName == "boardGlass8x8") {
            boardInfo = boardGlass8x8;
        } else if (levelName == "boardHeart10x10") {
            boardInfo = boardHeart10x10;
        }

        this.gamefield = lowfat.Gamefield(this, lowfat.SpriteFactory, cc.director.getWinSize());
        this.gamefield.start(boardInfo, markedCells, mistakenlyMarkedCells, livesLeft);
    },

    startLevelSelect: function () {

    },

    onResize: function () {
        var screenSizeInPoints = cc.director.getWinSize();
        this.gamefield.onResize(screenSizeInPoints);
    }
});