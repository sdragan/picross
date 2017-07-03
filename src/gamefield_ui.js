var lowfat = lowfat || {};

lowfat.PostLevelMenu = function (container, screenSizeInPoints, spriteFactory, restartCallback, backToMenuCallback) {
    var screenSize = screenSizeInPoints;
    var overlayContainer;
    var overlay;
    var menuContainer;

    var retryButton;
    var backToMenuButton;

    var selectedCallback;

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

    function showWon(livesLeft) {
        console.log("postLevel win menu; lives left: " + livesLeft);
        showOverlay();

        if (livesLeft < 3) {
            retryButton = createButton("Btn_Restart", "Btn_Restart_Over", screenSize.width / 2, -50, retryButtonTouchEvent);
            retryButton.setTouchEnabled(false);
            menuContainer.addChild(retryButton);
            retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, retryButton.getPositionX(), 360).easing(cc.easeBackOut())));
        }
        backToMenuButton = createButton("Btn_MoreGames", "Btn_MoreGames_Over", screenSize.width / 2 + 80, -50, backToMenuButtonTouchEvent);
        backToMenuButton.setTouchEnabled(false);
        menuContainer.addChild(backToMenuButton);
        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, backToMenuButton.getPositionX(), 360).easing(cc.easeBackOut()), new cc.CallFunc(showWinButtonsFinished)));

    }

    function showLost() {
        console.log("postLevel lost menu");
        showOverlay();

        retryButton = createButton("Btn_Restart", "Btn_Restart_Over", screenSize.width / 2, -50, retryButtonTouchEvent);
        retryButton.setTouchEnabled(false);
        menuContainer.addChild(retryButton);

        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, retryButton.getPositionX(), 360).easing(cc.easeBackOut()), new cc.CallFunc(showLostButtonsFinished)));
    }

    function showLostButtonsFinished() {
        retryButton.setTouchEnabled(true);
    }

    function showWinButtonsFinished() {
        if (retryButton) {
            retryButton.setTouchEnabled(true);
        }
        backToMenuButton.setTouchEnabled(true);
    }

    function retryButtonTouchEvent(sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            onRetryButton();
        }
    }

    function backToMenuButtonTouchEvent(sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            onBackToMenuButton();
        }
    }

    function onRetryButton() {
        selectedCallback = restartCallback;
        hideLostMenuButtons();
    }

    function onBackToMenuButton() {
        selectedCallback = backToMenuCallback;
        hideWinMenuButtons();
    }

    function hideLostMenuButtons() {
        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, retryButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn()), new cc.CallFunc(onHideButtonsFinished)));
    }

    function hideWinMenuButtons() {
        if (retryButton) {
            retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, retryButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn())));
        }
        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, backToMenuButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn()), new cc.CallFunc(onHideButtonsFinished)));
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

lowfat.LivesPanel = function (container, screenSizeInPoints, spriteFactory) {
    var icons = [];
    var livesCount = 3;

    function displayLifeIcons() {
        for (var i = 0; i < livesCount; i++) {
            var icon;
            if (icons.length <= i) {
                icon = spriteFactory.getSprite("LifeIcon");
                icons.push(icon);
                container.addChild(icon);
            } else {
                icon = icons[i];
                var delayAction = new cc.DelayTime(i * 0.05);
                var fadeInAction = new cc.FadeIn(0.1);
                icon.runAction(new cc.Sequence(delayAction, fadeInAction));
            }
            icon.setPosition((screenSizeInPoints.width / 2) + 40 * (-1 + i), 680);
        }
    }

    function setInitialLives(count) {
        livesCount = count;
        displayLifeIcons();
    }

    function decrementLife() {
        livesCount--;
        fadeLifeIcon(icons[livesCount]);
    }

    function fadeLifeIcon(icon) {
        var fadeAction = new cc.FadeOut(0.5);
        icon.runAction(fadeAction);
    }

    return {
        setInitialLives: setInitialLives,
        decrementLife: decrementLife
    }
};