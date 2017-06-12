var lowfat = lowfat || {};

lowfat.PostLevelMenu = function (container, screenSizeInPoints, spriteFactory) {
    var overlayContainer;
    var overlay;
    var menuContainer;

    init();

    function init() {
        overlayContainer = new cc.Node();
        overlay = new cc.LayerColor(cc.color(0, 0, 0, 50));
        overlay.setVisible(false);
        overlayContainer.addChild(overlay);
    }

    function showOverlay() {
        overlay.setVisible(true);
    }

    function hideOverlay() {

    }

    function createButton(outSkin, overSkin, x, y, onTriggeredEvent) {
        var button = new ccui.Button();
        var outSkinTextureName = spriteFactory.getMCTextureName(outSkin);
        var overSkinTextureName = spriteFactory.getMCTextureName(overSkin);
        button.loadTextures(outSkinTextureName, overSkinTextureName, "", ccui.Widget.PLIST_TEXTURE);
        button.setPosition(x, y);
        button.addTouchEventListener(onTriggeredEvent);
        return button;
    }

    function showWon() {
        console.log("postLevel win menu");
    }

    function showLost() {
        console.log("postLevel lost menu");
    }

    function onResize(screenSizeInPoints) {
    }

    return {
        onResize: onResize,
        showLost: showLost,
        showWon: showWon
    }
};