var lowfat = lowfat || {};

cc.game.onStart = function(){
    var sys = cc.sys;
    if(!sys.isNative && document.getElementById("cocosLoading"))
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);

    if (sys.isMobile &&
        sys.browserType !== sys.BROWSER_TYPE_BAIDU &&
        sys.browserType !== sys.BROWSER_TYPE_WECHAT) {
        cc.view.enableAutoFullScreen(true);
    }

    cc.view.adjustViewPort(true);
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);
    cc.view.setDesignResolutionSize(420, 720, cc.ResolutionPolicy.FIXED_HEIGHT);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        var texture = cc.textureCache.addImage(res.spritesheet_png);
        cc.spriteFrameCache.addSpriteFrames(res.spritesheet_plist, texture);

        var gameScene = new GameScene();
        gameScene.setup();
        cc.director.runScene(gameScene);

        cc.view.setResizeCallback(function() {
            gameScene.onResize();
        });
    }, this);
};
cc.game.run();