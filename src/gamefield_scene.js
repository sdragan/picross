var lowfat = lowfat || {};

var GamefieldScene = cc.Scene.extend({
    gamefield: null,

    setup: function () {
        this.gamefield = new lowfat.Gamefield(this, lowfat.SpriteManager);
        this.gamefield.start();
    },

    onResize: function () {
        var screenSizeInPoints = cc.director.getWinSize();
        this.gamefield.onResize(screenSizeInPoints);
    }
});