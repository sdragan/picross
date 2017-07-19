var lowfat = lowfat || {};

lowfat.GameStateModel = function () {
    var levelsState = {};

    var LOCAL_STORAGE_ID = "lowfat_picross";
    var LOCAL_STORAGE_ID_LEVELS_STATE = "lowfat_picross_levels_state";
    var SCENE_BOARD = "board";
    var SCENE_LEVEL_SELECT = "levelSelect";

    function init(boardCallback, levelSelectCallback, callbackContext) {
        var gameStateVO = getPresetLevelSelectGameState();

        if (gameStateVO.scene == SCENE_BOARD) {
            boardCallback.call(callbackContext, gameStateVO.levelName, gameStateVO.markedCells, gameStateVO.mistakenlyMarkedCells, gameStateVO.livesLeft);
        } else {
            levelSelectCallback.call(callbackContext, gameStateVO.levelName);
        }
    }

    function loadFromLocalStorage() {
        var rawGameState = cc.sys.localStorage.getItem(LOCAL_STORAGE_ID);
        var rawLevelsState = cc.sys.localStorage.getItem(LOCAL_STORAGE_ID_LEVELS_STATE);
        if (rawGameState !== undefined) {
            console.log("gameState found");
            var gameState = JSON.parse(rawGameState);
            var levelsState = rawLevelsState !== undefined ? JSON.parse(rawLevelsState) : {};
            parseLevelsState(levelsState);
            return buildGameStateVO(gameState.scene, gameState.levelName, gameState.markedCells, gameState.mistakenlyMarkedCells, gameState.livesLeft);
        } else {
            console.log("no gameState yet");
            return buildGameStateVO(SCENE_LEVEL_SELECT, "", [], [], 0);
        }
    }

    function initPresetLevelsState() {
        var presetLevelsStateVO = {
            "smallBoard4x5": 2,
            "boardDog5x5": 3,
            "boardGlass8x8": 0,
            "boardHeart10x10": -1
        };
        parseLevelsState(presetLevelsStateVO);
    }

    function getPresetBoardGameState() {
        initPresetLevelsState();
        var levelName = "smallBoard4x5";
        var markedCells = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var mistakenlyMarkedCells = [2];
        var livesLeft = 2;
        return buildGameStateVO(SCENE_BOARD, levelName, markedCells, mistakenlyMarkedCells, livesLeft);
    }

    function getPresetLevelSelectGameState() {
        initPresetLevelsState();
        return buildGameStateVO(SCENE_LEVEL_SELECT, "smallBoard4x5", [], [], 0);
    }

    function buildGameStateVO(scene, levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        return {
            scene: scene,
            levelName: levelName,
            markedCells: markedCells,
            mistakenlyMarkedCells: mistakenlyMarkedCells,
            livesLeft: livesLeft
        }
    }

    function parseLevelsState(levelsStateFromVO) {
        for (var levelName in levelsStateFromVO) {
            if (!levelsStateFromVO.hasOwnProperty(levelName)) continue;
            var stars = levelsStateFromVO[levelName];
            levelsState[levelName] = stars;
        }
    }

    function setLevelStatus(levelName, stars) {
        levelsState[levelName] = stars;
        saveLevelsState();
    }

    function saveFromBoard(levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        saveState(SCENE_BOARD, levelName, markedCells, mistakenlyMarkedCells, livesLeft);
    }

    function saveFromLevelSelect(levelName) {
        var levelNameToSave = (typeof levelName === "undefined" || !levelName) ? "" : levelName;
        saveState(SCENE_LEVEL_SELECT, levelNameToSave, [], 0);
    }

    function saveState(scene, levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        var gameStateVO = buildGameStateVO(scene, levelName, markedCells, mistakenlyMarkedCells, livesLeft);
        var jsonGameStateVO = JSON.stringify(gameStateVO);
        cc.sys.localStorage.setItem(LOCAL_STORAGE_ID, jsonGameStateVO);
    }

    function saveLevelsState() {
        var jsonLevelsState = JSON.stringify(levelsState);
        cc.sys.localStorage.setItem(LOCAL_STORAGE_ID_LEVELS_STATE, jsonLevelsState);
    }

    function getStateForLevel(levelName) {
        return levelsState[levelName];
    }

    return {
        init: init,
        saveFromBoard: saveFromBoard,
        saveFromLevelSelect: saveFromLevelSelect,
        setLevelStatus: setLevelStatus,
        getStateForLevel: getStateForLevel
    }
};

lowfat.LevelsModel = function () {
    var levels = {};

    initLevelList();

    function initLevelList() {
        levels["smallBoard4x5"] = lowfat.BoardInfo(4, 5, [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
        levels["boardDog5x5"] = lowfat.BoardInfo(5, 5, [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0]);
        levels["boardGlass8x8"] = lowfat.BoardInfo(8, 8, [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1]);
        levels["boardHeart10x10"] = lowfat.BoardInfo(10, 10, [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]);
    }

    function getBoardInfoByLevelName(levelName) {
        if (levels.hasOwnProperty(levelName)) {
            return levels[levelName];
        }
        throw new Error("Can't find level " + levelName);
    }

    return {
        getBoardInfoByLevelName: getBoardInfoByLevelName
    }
};