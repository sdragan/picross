var lowfat = lowfat || {};

lowfat.PostLevelMenu = function (container, screenSizeInPoints, spriteFactory, restartCallback) {
    var screenSize = screenSizeInPoints;
    var overlayContainer;
    var overlay;
    var menuContainer;
    var retryButton;

    var selectedCallback;
    var restartCallback;

    init();

    function init() {
        overlayContainer = new cc.Node();
        overlay = new cc.LayerColor(cc.color(0, 0, 0, 50));
        overlay.setVisible(false);
        overlayContainer.addChild(overlay);
        container.addChild(overlayContainer);

        menuContainer = new cc.Node();
        container.addChild(menuContainer);
    }

    function showOverlay() {
        overlay.setVisible(true);
    }

    function hideOverlay() {
        overlay.setVisible(false);
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
        showOverlay();

        retryButton = createButton("Btn_Restart", "Btn_Restart_Over", screenSize.width / 2, -50, retryButtonTouchEvent);
        retryButton.setTouchEnabled(false);
        menuContainer.addChild(retryButton);

        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, screenSize.width / 2, 360).easing(cc.easeBackOut()), new cc.CallFunc(showLostButtonsFinished)));
    }

    function showLostButtonsFinished() {
        retryButton.setTouchEnabled(true);
    }

    function retryButtonTouchEvent (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            onRetryButton();
        }
    }

    function onRetryButton() {
        selectedCallback = restartCallback;
        hideLostMenuButtons();
    }

    function hideLostMenuButtons() {
        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, retryButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn()), new cc.CallFunc(onHideButtonsFinished)));
    }

    function onHideButtonsFinished() {
        hideOverlay();
        selectedCallback();
    }

    function onResize(screenSizeInPoints) {
        screenSize = screenSizeInPoints;
    }

    return {
        onResize: onResize,
        showLost: showLost,
        showWon: showWon
    }
};