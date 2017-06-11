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

    function createButton(outSkin, overSkin, x, y, onTriggeredEvent) {
        var button = new ccui.Button();
        var outSkinTextureName = spriteFactory.getMCTextureName(outSkin);
        var overSkinTextureName = spriteFactory.getMCTextureName(overSkin);
        button.loadTextures(outSkinTextureName, overSkinTextureName, "", ccui.Widget.PLIST_TEXTURE);
        button.setPosition(x, y);
        button.addTouchEventListener(onTriggeredEvent);
        return button;
    }

    function onResize (screenSizeInPoints) {
    }

    return {
        onResize: onResize
    }
};