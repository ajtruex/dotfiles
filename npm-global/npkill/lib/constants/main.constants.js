"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_CLI_COLUMNS_SIZE = 60;
exports.CURSOR_SIMBOL = '~>';
exports.WIDTH_OVERFLOW = '...';
exports.DEFAULT_SIZE = '0 MB';
exports.DECIMALS_SIZE = 2;
exports.OVERFLOW_CUT_FROM = 8;
exports.DEFAULT_CONFIG = {
    backgroundColor: 'bgBlue',
    checkUpdates: true,
    deleteAll: false,
    exclude: [],
    folderSizeInGB: false,
    maxSimultaneousSearch: 6,
    showErrors: false,
    sortBy: '',
    targetFolder: 'node_modules',
};
exports.MARGINS = {
    FOLDER_COLUMN_END: 16,
    FOLDER_COLUMN_START: 2,
    FOLDER_SIZE_COLUMN: 10,
    ROW_RESULTS_START: 8,
};
exports.UI_HELP = {
    X_COMMAND_OFFSET: 3,
    X_DESCRIPTION_OFFSET: 27,
    Y_OFFSET: 2,
};
exports.UI_POSITIONS = {
    FOLDER_SIZE_HEADER: { x: -1, y: 7 },
    INITIAL: { x: 0, y: 0 },
    NEW_UPDATE_FOUND: { x: 42, y: 0 },
    SPACE_RELEASED: { x: 50, y: 4 },
    STATUS: { x: 50, y: 5 },
    TOTAL_SPACE: { x: 50, y: 3 },
    TUTORIAL_TIP: { x: 4, y: 7 },
};
exports.VALID_KEYS = ['up', 'down', 'space', 'j', 'k'];
exports.BANNER = `-----                    __   .__.__  .__
-           ____ ______ |  | _|__|  | |  |
------     /    \\\\____ \\|  |/ /  |  | |  |
----      |   |  \\  |_> >    <|  |  |_|  |__
--        |___|  /   __/|__|_ \\__|____/____/
-------        \\/|__|        \\/
`;
exports.STREAM_ENCODING = 'utf8';
