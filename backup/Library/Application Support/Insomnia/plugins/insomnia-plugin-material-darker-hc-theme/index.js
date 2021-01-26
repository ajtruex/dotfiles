'use strict';
const colors = {
    red: '#ff5370',
    orange: '#f78c6c',
    yellow: '#ffcb6b',
    green: '#c3e88d',
    darkerGreen: '#91b65e',
    blue: '#82aaff',
    cyan: '#89ddff',
    purple: '#c792ea',
    darkerPurple: '#9563b7',
    gray: '#848484',

    background: '#212121',
    darkerBackground: '#1a1a1a',
    foreground: '#eeffff',
    selection: 'rgba(97, 97, 97, 0.5)',
    darkerSelection: 'rgba(97, 97, 97, 0.2)'
};

/*
    highlight legend
    ----------------

    default: controls text color when no other colors apply. (tab labels, timeline, side bar labels)

    xxs: text box backgrounds, and tab exponent borders

    xs: background for side bar selections, scroll bars, keyboard shortcuts

    sm: foreground and border for inactive tab exponents, pane header info boxes (time, size),
        popup menu borders, and popup menu hovers

    md: borders around any user-input area (text boxes, drop downs, tabs, etc.), also used
        as a background when a user clicks on a control (like tabs or popup menu entries),
        also used for the scrollbar handle (the part the user can drag)

    lg: code folding arrows. text hints inside text boxes.  separator lines on popup menus
        border around some buttons on the preferences menu.

    xl: line numbers in the editor, keyboard shortcuts shown on popup menus,
*/

// establish a baseline
const base = {
    name: 'material-darker-hc',
    displayName: 'Material Darker (HC)',
    theme: {
        // CSS hacks make me sad, but until the syntax highlighting can be controlled
        // directly, this is the only way.
        rawCss: `
            .editor .CodeMirror-selected {
                background-color: ${colors.gray};
            }

            .editor .cm-atom, .editor .cm-number {
                color: ${colors.orange};
            }

            .editor .cm-string {
                color: ${colors.green};
            }

            .editor .cm-string.cm-property {
                color: ${colors.purple};
            }

            .editor .cm-attribute {
                color: ${colors.purple};
            }

            .editor .cm-bracket {
                color: ${colors.cyan};
            }

            .editor .cm-meta {
                font-style: italic;
                color: ${colors.gray};
            }

            .editor .cm-variable {
                color: ${colors.red};
            }
            `,
        background: {
            default: colors.background,
            success: colors.green,
            notice: colors.yellow,
            warning: colors.orange,
            danger: colors.red,
            surprise: colors.purple,
            info: colors.blue
        },
        foreground: {
            default: colors.foreground
        },
        highlight: {
            default: colors.gray,
            xl: colors.selection
        },
        styles: {}
    }
};

// hyperlinks
base.theme.styles.link = {
    foreground: {
        default: colors.purple
    }
};

// side bar
base.theme.styles.sidebar = {
    background: {
        default: colors.darkerBackground
    },
    highlight: {
        xs: colors.darkerSelection, // background for active item and scrollbar
        md: colors.selection // scrollbar handle itself
    }
};
base.theme.styles.sidebarHeader = {
    background: {
        default: colors.darkerPurple
    },
    highlight: {
        default: colors.darkerPurple,
        xs: colors.darkerPurple,
        md: colors.darkerPurple
    }
};

// header bar above request details
base.theme.styles.pane = {
    highlight: {
        xs: colors.background,
        md: colors.selection
    }
};
base.theme.styles.paneHeader = {
    background: {
        success: colors.darkerGreen,
        notice: colors.yellow,
        warning: colors.orange,
        danger: colors.red,
        surprise: colors.purple,
        info: colors.blue
    }
};

// an overlay that is placed on top of everything when modal dialogs are opened.
base.theme.styles.transparentOverlay = {
    background: {
        default: colors.selection
    }
};

module.exports.themes = [base];
