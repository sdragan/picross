var lowfat = lowfat || {};

var GameScene = cc.Scene.extend({
    gamefield: null,

    setup: function () {
        this.gamefield = lowfat.Gamefield(this, lowfat.SpriteFactory, cc.director.getWinSize());
        this.gamefield.start();
    },

    onResize: function () {
        var screenSizeInPoints = cc.director.getWinSize();
        this.gamefield.onResize(screenSizeInPoints);
    }
});