var lowfat = lowfat || {};

var GameScene = cc.Scene.extend({
    gamefield: null,

    setup: function () {
        this.gamefield = new lowfat.Gamefield(this, lowfat.SpriteFactory);
        this.gamefield.start();
    },

    onResize: function () {
        var screenSizeInPoints = cc.director.getWinSize();
        this.gamefield.onResize(screenSizeInPoints);
    }
});