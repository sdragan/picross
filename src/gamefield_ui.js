var lowfat = lowfat || {};

lowfat.PostLevelLostMenu = function (container, screenSize, spriteFactory, restartCallback, backToMenuCallback) {
    var screenSizeInPoints = screenSize;
    var overlay;
    var buttonsContainer;

    var retryButton;
    var backToMenuButton;

    var selectedCallback;

    init();

    function init() {
        overlay = lowfat.FullscreenOverlay(container, screenSizeInPoints);
        buttonsContainer = new cc.Node();
        container.addChild(buttonsContainer);
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

    function show() {
        overlay.show();

        var retryButtonX = screenSize.width / 2 - 50;
        retryButton = createButton("Btn_Restart", "Btn_Restart_Over", retryButtonX, -50, retryButtonTouchEvent);
        retryButton.setTouchEnabled(false);
        buttonsContainer.addChild(retryButton);

        var backToMenuButtonX = screenSize.width / 2 + 50;
        backToMenuButton = createButton("Btn_Back_To_Menu", "Btn_Back_To_Menu_Over", backToMenuButtonX, -50, backToMenuButtonTouchEvent);
        backToMenuButton.setTouchEnabled(false);
        buttonsContainer.addChild(backToMenuButton);

        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, backToMenuButton.getPositionX(), 360).easing(cc.easeBackOut())));
        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, retryButton.getPositionX(), 360).easing(cc.easeBackOut()), new cc.CallFunc(showButtonsFinished)));
    }

    function showButtonsFinished() {
        retryButton.setTouchEnabled(true);
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
        hideButtons();
    }

    function onBackToMenuButton() {
        selectedCallback = backToMenuCallback;
        hideButtons();
    }

    function hideButtons() {
        retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, retryButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn())));
        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, backToMenuButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn()), new cc.CallFunc(onHideButtonsFinished)));
    }

    function onHideButtonsFinished() {
        retryButton.removeFromParent();
        backToMenuButton.removeFromParent();
        overlay.hide();
        selectedCallback();
    }

    return {
        show: show
    }
};

lowfat.PostLevelWinMenu = function (container, screenSize, spriteFactory, livesLeft, restartCallback, backToMenuCallback) {
    var screenSizeInPoints = screenSize;
    var overlay;
    var buttonsContainer;

    var retryButton;
    var backToMenuButton;

    var selectedCallback;

    init();

    function init() {
        overlay = lowfat.FullscreenOverlay(container, screenSizeInPoints);
        buttonsContainer = new cc.Node();
        container.addChild(buttonsContainer);
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

    function show() {
        overlay.show();

        var backToMenuButtonX = screenSize.width / 2;

        if (livesLeft < 3) {
            backToMenuButtonX = screenSize.width / 2 + 50;
            var retryButtonX = screenSize.width / 2 - 50;
            retryButton = createButton("Btn_Restart", "Btn_Restart_Over", retryButtonX, -50, retryButtonTouchEvent);
            retryButton.setTouchEnabled(false);
            buttonsContainer.addChild(retryButton);
            retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, retryButton.getPositionX(), 360).easing(cc.easeBackOut())));
        }

        backToMenuButton = createButton("Btn_Back_To_Menu", "Btn_Back_To_Menu_Over", backToMenuButtonX, -50, backToMenuButtonTouchEvent);
        backToMenuButton.setTouchEnabled(false);
        buttonsContainer.addChild(backToMenuButton);
        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.7, backToMenuButton.getPositionX(), 360).easing(cc.easeBackOut()), new cc.CallFunc(showButtonsFinished)));
    }

    function showButtonsFinished() {
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
        hideButtons();
    }

    function onBackToMenuButton() {
        selectedCallback = backToMenuCallback;
        hideButtons();
    }

    function hideButtons() {
        if (retryButton) {
            retryButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, retryButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn())));
        }
        backToMenuButton.runAction(new cc.Sequence(new cc.MoveTo(0.5, backToMenuButton.getPositionX(), -50).easing(cc.easeQuadraticActionIn()), new cc.CallFunc(onHideButtonsFinished)));
    }

    function onHideButtonsFinished() {
        if (retryButton) {
            retryButton.removeFromParent();
        }
        backToMenuButton.removeFromParent();
        overlay.hide();
        selectedCallback();
    }

    return {
        show: show
    }
};

lowfat.FullscreenOverlay = function (container, screenSize) {

    var screenSizeInPoints = screenSize;
    var overlay = null;

    init();

    function init() {
        overlay = new cc.LayerColor(cc.color(0, 0, 0, 50));
        overlay.setVisible(false);
        container.addChild(overlay);
    }

    function show() {
        overlay.setVisible(true);
    }

    function hide() {
        overlay.setVisible(false);
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;
        overlay.setContentSize(screenSizeInPoints.width, screenSizeInPoints.height);
    }

    return {
        show: show,
        hide: hide,
        onResize: onResize
    }
};


lowfat.LivesPanel = function (container, screenSize, spriteFactory) {
    var screenSizeInPoints = screenSize;
    var icons = [];
    var emptyIcons = [];
    var livesCount = 3;

    function displayLifeIcons() {
        var i;

        for (i = 0; i < 3; i++) {
            var emptyIcon;
            if (emptyIcons.length <= i) {
                emptyIcon = spriteFactory.getSprite("LifeIconEmpty");
                emptyIcons.push(emptyIcon);
                container.addChild(emptyIcon);
                emptyIcon.setPosition(getIconX(i), 680);
            } else {
                emptyIcon = emptyIcons[i];
            }
            emptyIcon.setVisible(i >= livesCount - 1);
        }

        for (i = 0; i < livesCount; i++) {
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
            icon.setPosition(getIconX(i), 680);
        }
    }

    function getIconX(iconIndex) {
        return (screenSizeInPoints.width / 2) + 40 * (-1 + iconIndex);
    }

    function setInitialLives(count) {
        livesCount = count;
        displayLifeIcons();
    }

    function decrementLife() {
        livesCount--;
        fadeLifeIcon(icons[livesCount]);
        emptyIcons[livesCount].setVisible(true);
    }

    function fadeLifeIcon(icon) {
        var fadeAction = new cc.FadeOut(0.5);
        icon.runAction(fadeAction);
    }

    function clear() {
        var i;
        for (i = 0; i < icons.length; i++) {
            icons[i].removeFromParent();
        }
        for (i = 0; i < emptyIcons.length; i++) {
            emptyIcons[i].removeFromParent();
        }
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;
        var i;
        for (i = 0; i < icons.length; i++) {
            icons[i].setPositionX(getIconX(i));
        }
        for (i = 0; i < emptyIcons.length; i++) {
            emptyIcons[i].setPositionX(getIconX(i));
        }
    }

    return {
        setInitialLives: setInitialLives,
        decrementLife: decrementLife,
        clear: clear,
        onResize: onResize
    }
};