var lowfat = lowfat || {};

lowfat.LevelSelectMenu = function (container, spriteFactory, gameStateModel, levelsModel, startBoardCallback, startBoardContext, screenSize) {
    var screenSizeInPoints = screenSize;
    var thumbnailsContainer = null;
    var thumbnailsContainerContainer = null;
    var touchControls = null;
    var thumbnails = null;
    var selectedThumbnail = null;

    var speed = 0;
    var inertiaRatio = 0.88;
    var isMovingByInertia = false;
    var dragMinX = 0;
    var dragMaxX = 0;
    var lastDirection = 2;

    var DIRECTION_LEFT = 0;
    var DIRECTION_RIGHT = 1;
    var DIRECTION_ANY = 2;

    function initLayers() {
        thumbnailsContainerContainer = new cc.Node();
        container.addChild(thumbnailsContainerContainer);

        thumbnailsContainer = new cc.Node();
        thumbnailsContainerContainer.addChild(thumbnailsContainer);
        updateThumbnailsContainerContainerX();
    }

    function initThumbnails() {
        thumbnails = [];
        var levelList = levelsModel.getLevelList();
        for (var i = 0; i < levelList.length; i++) {
            var levelName = levelList[i];
            var boardInfo = levelsModel.getBoardInfoByLevelName(levelName);
            var levelState = gameStateModel.getLevelStateByLevelName(levelName);
            var thumbnail = lowfat.LevelThumbnail(spriteFactory, boardInfo, levelName, levelState, processLevelSelected);
            var thumbnailX = i > 0 ? thumbnails[i - 1].getPositionX() + thumbnails[i - 1].getWidth() + 20 : -thumbnail.getWidth() / 2;
            var thumbnailY = (screenSizeInPoints.height - thumbnail.getHeight()) / 2;
            thumbnail.addToParent(thumbnailsContainer);
            thumbnail.setPosition(thumbnailX, thumbnailY);
            thumbnails.push(thumbnail);
            thumbnail.unHighlight();
        }
        dragMinX = -thumbnails[thumbnails.length - 1].getCenterX();
        dragMaxX = 0;
    }

    function initControls() {
        touchControls = lowfat.LevelSelectTouchControls(container, processControlsTouchEnd, processControlsDrag, processControlsDragEnd);
        touchControls.enable();
    }

    function processControlsDrag(deltaX, deltaY) {
        speed = deltaX;
        scrollThumbnailsContainerBy(deltaX);
        lastDirection = deltaX > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    function processControlsDragEnd() {
        console.log(speed);
        if (Math.abs(speed) > 10) {
            isMovingByInertia = true;
        } else {
            scrollToClosestThumbnail(DIRECTION_ANY);
        }
    }

    function scrollToClosestThumbnail(direction) {
        var closestThumbnail = findClosestThumbnail(direction);
        scrollToThumbnail(closestThumbnail);
    }

    function findClosestThumbnail(direction) {
        var containerX = thumbnailsContainer.getPositionX();
        var closestLeftThumbnailIndex = -1;
        var closestRightThumbnailIndex = -1;
        var minDistanceToLeft = -1;
        var minDistanceToRight = 1;

        for (var i = 0; i < thumbnails.length; i++) {
            var distance = -containerX - (thumbnails[i].getCenterX());
            if (distance > 0) {
                if (closestLeftThumbnailIndex < 0 || minDistanceToLeft > distance) {
                    minDistanceToLeft = distance;
                    closestLeftThumbnailIndex = i;
                }
            } else {
                if (closestRightThumbnailIndex < 0 || minDistanceToRight < distance) {
                    minDistanceToRight = distance;
                    closestRightThumbnailIndex = i;
                }
            }
        }

        if (direction == DIRECTION_LEFT && closestLeftThumbnailIndex >= 0) {
            return thumbnails[closestLeftThumbnailIndex];
        }

        if (direction == DIRECTION_RIGHT && closestRightThumbnailIndex >= 0) {
            return thumbnails[closestRightThumbnailIndex];
        }

        if (closestLeftThumbnailIndex >= 0 && closestRightThumbnailIndex >= 0) {
            return Math.abs(minDistanceToLeft) < Math.abs(minDistanceToRight) ? thumbnails[closestLeftThumbnailIndex] : thumbnails[closestRightThumbnailIndex];
        }

        return closestLeftThumbnailIndex >= 0 ? thumbnails[closestLeftThumbnailIndex] : thumbnails[closestRightThumbnailIndex];
    }

    function centerListOnLastPlayedLevel(levelName) {
        if (typeof levelName === "undefined" || !levelName) {
            levelName = thumbnails[0].getLevelName();
        }
        var thumbnail = getThumbnailByLevelName(levelName);
        selectedThumbnail = thumbnail;
        thumbnail.highlight();
        thumbnailsContainer.setPositionX(getThumbnailsContainerXToGetLevelInCenter(thumbnail));
    }

    function getThumbnailsContainerXToGetLevelInCenter(thumbnail) {
        return -(thumbnail.getPositionX() + thumbnail.getWidth() * 0.5);
    }

    function updateThumbnailsContainerContainerX() {
        thumbnailsContainerContainer.setPositionX(screenSizeInPoints.width * 0.5);
    }

    function start(levelName) {
        initLayers();
        initThumbnails();
        initControls();
        centerListOnLastPlayedLevel(levelName);
    }

    function update(dt) {
        if (isMovingByInertia) {
            if (Math.abs(speed) > 0.8) {
                scrollThumbnailsContainerBy(speed);
                speed *= inertiaRatio;
            } else {
                isMovingByInertia = false;
                scrollToClosestThumbnail(lastDirection);
                speed = 0;
            }
        }
    }

    function scrollThumbnailsContainerBy(scrollAmount) {
        var positionX = thumbnailsContainer.getPositionX();
        if (positionX <= dragMinX && scrollAmount < 0) {
            thumbnailsContainer.setPositionX(dragMinX);
            if (isMovingByInertia) {
                speed = 0;
            }
        } else if (positionX >= dragMaxX && scrollAmount > 0) {
            thumbnailsContainer.setPositionX(dragMaxX);
            if (isMovingByInertia) {
                speed = 0;
            }
        } else {
            thumbnailsContainer.setPositionX(positionX + scrollAmount);
        }
    }

    function processControlsTouchEnd(eventX, eventY) {
        var touchX = eventX - thumbnailsContainerContainer.getPositionX() - thumbnailsContainer.getPositionX();
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].processMouseClick(touchX, eventY);
        }
    }

    function processLevelSelected(levelName) {
        var thumbnail = getThumbnailByLevelName(levelName);
        if (thumbnail == selectedThumbnail) {
            if (gameStateModel.getLevelStateByLevelName(levelName) < 0) {
                return;
            }

            for (var i = 0; i < thumbnails.length; i++) {
                thumbnails[i].removeFromParent();
            }
            touchControls.disable();
            startBoardCallback.call(startBoardContext, levelName, [], [], 3);
        } else {
            scrollToThumbnail(thumbnail);
        }
    }

    function scrollToThumbnail(thumbnail) {
        var newThumbnailContainerX = getThumbnailsContainerXToGetLevelInCenter(thumbnail);
        var diff = newThumbnailContainerX - thumbnailsContainer.getPositionX();
        if (Math.abs(diff) > 0.1) {
            thumbnailsContainer.stopAllActions();
            var moveAction = new cc.MoveBy(0.5, diff, 0).easing(cc.easeCubicActionOut());
            var callFuncAction = new cc.CallFunc(scrollFinished);
            thumbnailsContainer.runAction(new cc.Sequence(moveAction, callFuncAction));
        } else {
            thumbnailsContainer.setPositionX(thumbnailsContainer.getPositionX() + diff);
        }

        if (selectedThumbnail != thumbnail) {
            thumbnail.highlight();
            selectedThumbnail.unHighlight();
            selectedThumbnail = thumbnail;
        }
    }

    function scrollFinished() {
    }

    function getThumbnailByLevelName(levelName) {
        for (var i = 0; i < thumbnails.length; i++) {
            if (thumbnails[i].getLevelName() == levelName) {
                return thumbnails[i];
            }
        }
        throw new Error("Couldn't find thumbnail for level: " + levelName);
    }

    function onResize(screenSize) {
        screenSizeInPoints = screenSize;
        updateThumbnailsContainerContainerX();
    }

    return {
        start: start,
        update: update,
        onResize: onResize
    }
};

lowfat.LevelThumbnail = function (spriteFactory, boardInfo, levelName, state, selectedCallback) {
    var cellSize = 24;
    var bgSize = 48;

    var cols = boardInfo.getCols();
    var rows = boardInfo.getRows();
    var elementsArray = boardInfo.getElementsArray();

    var thumbnailNode = new cc.Node();
    thumbnailNode.setCascadeOpacityEnabled(true);
    var isMouseOver = false;
    var isHighlighted = true;

    if (state > 0) {
        drawUnlocked();
    } else if (state < 0) {
        drawLocked();
    } else {
        drawAvailableButNotWon();
    }

    function drawLocked() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackgroundLocked", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);
        var lockIcon = spriteFactory.getSprite("LevelThumbnailLockIcon");
        lockIcon.setPosition(getWidth() / 2, getHeight() / 2);
        thumbnailNode.addChild(lockIcon);
    }

    function drawAvailableButNotWon() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackground", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);
        var lockIcon = spriteFactory.getSprite("LevelThumbnailQuestionMarkIcon");
        lockIcon.setPosition(getWidth() / 2, getHeight() / 2);
        thumbnailNode.addChild(lockIcon);
    }

    function drawUnlocked() {
        var bgRatio = bgSize / cellSize;
        var scaleX = cols / bgRatio;
        var scaleY = rows / bgRatio;
        var bg = spriteFactory.getSprite("LevelThumbnailBackground", 0, 0);
        bg.setScale(scaleX, scaleY);
        thumbnailNode.addChild(bg);

        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                var spriteName = getIsFilled(col, row) ? "LevelThumbnailFilledCell" : "LevelThumbnailEmptyCell";
                var cellContent = spriteFactory.getSprite(spriteName);
                cellContent.setPosition(cellSize / 2 + cellSize * col, cellSize * rows - cellSize * row - cellSize / 2);
                thumbnailNode.addChild(cellContent);
            }
        }
    }

    function highlight() {
        if (isHighlighted) {
            return;
        }
        thumbnailNode.setOpacity(255);
        isHighlighted = true;
    }

    function unHighlight() {
        if (!isHighlighted) {
            return;
        }
        thumbnailNode.setOpacity(120);
        isHighlighted = false;
    }

    function addToParent(parent) {
        parent.addChild(thumbnailNode);
    }

    function removeFromParent() {
        thumbnailNode.removeFromParent();
    }

    function setPosition(x, y) {
        thumbnailNode.setPosition(x, y);
    }

    function getPositionX() {
        return thumbnailNode.getPositionX();
    }

    function getPositionY() {
        return thumbnailNode.getPositionY();
    }

    function getIsFilled(x, y) {
        return elementsArray[y * cols + x] == 1;
    }

    function getWidth() {
        return cols * cellSize;
    }

    function getHeight() {
        return rows * cellSize;
    }

    function getLevelName() {
        return levelName;
    }

    function getCenterX() {
        return getPositionX() + getWidth() * 0.5;
    }

    function processMouseMove(eventX, eventY) {
        if (eventHitsNode(eventX, eventY)) {
            if (!isMouseOver) {

            }
        } else {
            if (isMouseOver) {

            }
        }
    }

    function processMouseClick(eventX, eventY) {
        if (eventHitsNode(eventX, eventY)) {
            selectedCallback(levelName);
        }
    }

    function eventHitsNode(eventX, eventY) {
        if (eventX > thumbnailNode.getPositionX() && eventX < thumbnailNode.getPositionX() + cols * cellSize) {
            if (eventY > thumbnailNode.getPositionY() && eventY < thumbnailNode.getPositionY() + rows * cellSize) {
                return true;
            }
        }
        return false;
    }

    return {
        addToParent: addToParent,
        removeFromParent: removeFromParent,
        setPosition: setPosition,
        getPositionX: getPositionX,
        getPositionY: getPositionY,
        getWidth: getWidth,
        getHeight: getHeight,
        getCenterX: getCenterX,
        processMouseMove: processMouseMove,
        processMouseClick: processMouseClick,
        highlight: highlight,
        unHighlight: unHighlight,
        getLevelName: getLevelName
    }
};

lowfat.LevelSelectTouchControls = function (scene, touchEndCallback, dragCallback, dragEndCallback) {
    var touchStarted = false;
    var enabled = false;
    var isDragging = false;

    function enable() {
        if (enabled) {
            throw new Error("Trying to enable controls, but they are already enabled");
        }
        enabled = true;
        addListeners();
    }

    function disable() {
        if (!enabled) {
            throw new Error("Trying to disable controls, but they are already disabled");
        }
        enabled = false;
        removeListeners();
    }

    function addListeners() {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                processTouchStarted(touch.getLocation().x, touch.getLocation().y);
                return true;
            },
            onTouchMoved: function (touch, event) {
                processTouchUpdated(touch.getLocation().x, touch.getLocation().y, touch.getDelta())
            },
            onTouchEnded: function (touch, event) {
                processTouchEnded(touch.getLocation().x, touch.getLocation().y);
            }
        }, scene);
    }

    function removeListeners() {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    }

    function forceStopDrag() {
        touchStarted = false;
    }

    function processTouchStarted(touchX, touchY) {
        touchStarted = true;
        isDragging = false;
    }

    function processTouchUpdated(touchX, touchY, delta) {
        if (Math.abs(delta.x) >= 1) {
            isDragging = true;
            dragCallback(delta.x, delta.y);
        }
    }

    function processTouchEnded(touchX, touchY) {
        if (!touchStarted) {
            return;
        }

        touchStarted = false;
        if (isDragging) {
            dragEndCallback();
        }
        else {
            touchEndCallback(touchX, touchY);
        }
    }

    return {
        enable: enable,
        disable: disable,
        forceStopDrag: forceStopDrag
    }
};