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
    cc.view.setDesignResolutionSize(480, 720, cc.ResolutionPolicy.FIXED_HEIGHT);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        var gamefieldScene = new GamefieldScene();
        gamefieldScene.setup();
        cc.director.runScene(gamefieldScene);

        cc.view.setResizeCallback(function() {
            gamefieldScene.onResize();
        });
    }, this);
};
cc.game.run();