var GamefieldScene = cc.Scene.extend({
    setup: function () {
        console.log("Setup called");
    },

    onResize: function () {
        var winSize = cc.director.getWinSize();
    }
});