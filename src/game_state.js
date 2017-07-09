var lowfat = lowfat || {};

lowfat.GameStateModel = function () {
    var levelsState = {};

    var LOCAL_STORAGE_ID = "lowfat_picross";
    var SCENE_BOARD = "board";
    var SCENE_LEVEL_SELECT = "levelSelect";

    function init(boardCallback, levelSelectCallback, callbackContext) {
        var gameStateVO = getPresetGameState();

        if (gameStateVO.scene == SCENE_BOARD) {
            boardCallback.call(callbackContext, gameStateVO.levelName, gameStateVO.markedCells, gameStateVO.mistakenlyMarkedCells, gameStateVO.livesLeft);
        } else {
            levelSelectCallback.call(callbackContext);
        }
    }

    function loadFromLocalStorage() {
        var rawGameState = cc.sys.localStorage.getItem(LOCAL_STORAGE_ID);
        if (rawGameState !== undefined) {
            console.log("gameState found");
            return JSON.parse(rawGameState);
        } else {
            console.log("no gameState yet");
            return buildGameStateVO(SCENE_LEVEL_SELECT, "", [], 0, {});
        }
    }

    function getPresetGameState() {
        var levelName = "smallBoard4x5";
        var markedCells = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var mistakenlyMarkedCells = [2];
        var livesLeft = 2;
        return buildGameStateVO(SCENE_BOARD, levelName, markedCells, mistakenlyMarkedCells, livesLeft, {});
    }

    function buildGameStateVO(scene, levelName, markedCells, mistakenlyMarkedCells, livesLeft, levelsState) {
        return {
            scene: scene,
            levelName: levelName,
            markedCells: markedCells,
            mistakenlyMarkedCells: mistakenlyMarkedCells,
            livesLeft: livesLeft,
            levelsState: levelsState
        }
    }

    function parseLevelsState(levelsStateFromVO) {

    }

    function saveFromBoard(levelName, markedCells, mistakenlyMarkedCells, livesLeft) {
        saveState(SCENE_BOARD, levelName, markedCells, mistakenlyMarkedCells, livesLeft);
    }

    function saveFromLevelSelect() {
        saveState(SCENE_LEVEL_SELECT, "", [], 0);
    }

    function saveState(scene, levelName, markedCells, mistakenlyMarkedCells, livesLeft) {

    }

    function getStateForLevel(levelName) {
        return levelsState[levelName];
    }

    return {
        init: init,
        saveFromBoard: saveFromBoard,
        saveFromLevelSelect: saveFromLevelSelect,
        getStateForLevel: getStateForLevel
    }
};