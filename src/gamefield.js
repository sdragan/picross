var lowfat = lowfat || {};

var GamefieldScene = cc.Scene.extend({
    setup: function () {
        var board = new lowfat.Board(3, 3, [0, 0, 1, 1, 1, 1, 1, 0, 1]);
    },

    onResize: function () {
        var winSize = cc.director.getWinSize();
    }
});