var lowfat = lowfat || {};

var GameScene = cc.Scene.extend({
    gamefield: null,
    levelSelectMenu: null,
    gameStateModel: null,
    levelsModel: null,
    updateReceiver: null,

    setup: function () {
        this.levelsModel = lowfat.LevelsModel();
        this.gameStateModel = lowfat.GameStateModel(this.levelsModel);
        this.gameStateModel.init(this.startBoard, this.startLevelSelect, this);
        this.scheduleUpdate();
    },

    startBoard: function (levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        var boardInfo = this.levelsModel.getBoardInfoByLevelName(levelName);
        this.gamefield = lowfat.Gamefield(this, lowfat.SpriteFactory, this.gameStateModel, cc.director.getWinSize(), this.startLevelSelect, this);
        this.gamefield.start(levelName, boardInfo, markedCells, mistakenlyMarkedCells, livesLeft);
        this.updateReceiver = this.gamefield;
    },

    startLevelSelect: function (levelName) {
        this.levelSelectMenu = lowfat.LevelSelectMenu(this, lowfat.SpriteFactory, this.gameStateModel, this.levelsModel, this.startBoard, this, cc.director.getWinSize());
        this.levelSelectMenu.start(levelName);
        this.updateReceiver = this.levelSelectMenu;
    },

    update: function (dt) {
        this.updateReceiver.update(dt);
    },

    onResize: function () {
        var screenSizeInPoints = cc.director.getWinSize();
        if (this.gamefield != null) {
            this.gamefield.onResize(screenSizeInPoints);
        }
        if (this.levelSelectMenu != null) {
            this.levelSelectMenu.onResize(screenSizeInPoints);
        }
    }
});