# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:/usr/local/sbin:/opt/local/bin:/opt/local/USD/bin:$PATH

export PATH=$HOME/bin:/usr/local/bin:/usr/local/sbin:/opt/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/andrewtruex/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="ajtruex"
# ZSH_THEME="powerlevel10k/powerlevel10k"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
# plugins=(git)
# plugins=(git git-prompt zsh-completions sublime brew node npm osx thefuck z history autojump zsh-syntax-highlighting zsh-history-substring-search rust cargo colored-man-pages zsh-autosuggestions zsh-better-npm-completion pip python virtualenv vue golang github iterm2 nvm)

plugins=(git git-prompt zsh-completions sublime brew node npm macos thefuck z history autojump zsh-syntax-highlighting zsh-history-substring-search rust colored-man-pages zsh-autosuggestions zsh-better-npm-completion pip python virtualenv golang github iterm2 nvm gitignore man)

zstyle ':omz:update' mode reminder

source $ZSH/oh-my-zsh.sh

source ~/.git-prompt.sh
# if type brew &>/dev/null; then
#   FPATH=$(brew --prefix)/share/zsh/site-functions:$FPATH

#   autoload -Uz compinit
#   compinit
# fi
FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
# autoload -U compinit && compinit

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
alias zshconfig="code ~/.zshrc"
alias ohmyzsh="code ~/.oh-my-zsh"
alias refresh="source ~/.zshrc"
alias ..="cd .."
alias nrd="npm run dev"
alias nrs="npm run serve"
alias nrst="npm run start"
alias npmi="npm install"
alias npmin="npm info"
alias nrb="npm run build"
alias nrg="npm run generate"
alias nlg='npm list --global --depth=0'
alias yrd="yarn run dev"
alias brewi="brew install"
alias brewin="brew info"
alias brews="brew search"
alias brewci="brew cask install"
alias brewcin="brew cask info"

# alias npm="nocorrect npm"
alias config="nocorrect config"
alias saber="nocorrect saber"
# alias gita="git add ."
# alias gitc="git commit -m"
alias gpom="git push origin master"
# unalias mysql
# alias mysql='/usr/local/mysql/bin/mysql -uroot -p'
# alias mysqladmin='/usr/local/mysql/bin/mysqladmin -u root -p'
alias tree="tree -C --du -h -a -L 2 -I 'node_modules'"
alias rate="curl rate.sx"
alias ls="ls -aG"
alias ll="ls -latrG"
alias ql="quick-look"
alias whoami="id -un"
alias name="id -F"
alias mi="micro"
alias ef="electron-forge"
alias ee="elementary-electron"
alias vs="vue serve"
alias gcl="gclonecd"
alias wh="whence -as"
alias google="googler -n 5 -c us -l us"
alias dsstore="find . -name '*.DS_Store' -type f -ls -delete"
alias nodemodules="find . -name "node_modules" -exec rm -rf '{}' +"
alias codei=/usr/local/bin/code-insiders
alias ytaud="youtube-dl -x --audio-format mp3 --output /Users/andrewtruex/Downloads/'%(title)s.%(ext)s'"
alias tt-dl="tiktok-scraper"
alias bz2="bzip2"
alias ytbest="yt-dlp -f 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]'"
alias python=/usr/local/bin/python3
# alias pip=/usr/local/bin/pip3
alias ils='timg --grid=2x1 --upscale=i --center --title --frames=1 '
# alias lsd="lsd -l"

export ZLS_COLORS='BxBxhxDxfxhxhxhxhxcxcx'

export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK=1


function mk() {
  mkdir -p "$@" && cd "$@"
}

chpwd() {
  ls
}
gccd() {
  git clone "$1" && cd "$(basename "$1" .git)"
}

gacp() {
  git add . && git nccommit && gpom

}

rmd () {
  pandoc $1 | lynx -stdin
}

secoff() {
	sudo spctl --master-disable && sudo spctl --status
}



# source ~/.iterm2_shell_integration.zsh

export PATH="/usr/local/opt/curl/bin:$PATH"
if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi

export EDITOR="code"

export PATH="/Users/andrewtruex/.deno/bin:$PATH"

export IPFS_PATH=/Users/andrewtruex/.ipfs

# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc'
# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc'

# tabtab source for packages
# uninstall by removing these lines
[[ -f ~/.config/tabtab/__tabtab.zsh ]] && . ~/.config/tabtab/__tabtab.zsh || true

# twilio autocomplete setup
TWILIO_AC_ZSH_SETUP_PATH=/Users/andrewtruex/.twilio-cli/autocomplete/zsh_setup && test -f $TWILIO_AC_ZSH_SETUP_PATH && source $TWILIO_AC_ZSH_SETUP_PATH
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
# [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export PATH=/Applications/MEGAcmd.app/Contents/MacOS:$PATH



unsetopt PROMPT_SP

eval "$(starship init zsh)"

# Created by `pipx` on 2022-06-14 18:56:54
export PATH="$PATH:/Users/andrewtruex/.local/bin"

SPACESHIP_PROMPT_ASYNC=FALSE
export PATH=$PATH:/Users/andrewtruex/.spicetify

source /Users/andrewtruex/.config/broot/launcher/bash/br

# bun completions
[ -s "/Users/andrewtruex/.bun/_bun" ] && source "/Users/andrewtruex/.bun/_bun"

if [[ $TERM_PROGRAM != "WarpTerminal" ]]; then
##### WHAT YOU WANT TO DISABLE FOR WARP - BELOW

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"


fi

if [[ $TERM_PROGRAM == "WarpTerminal" ]]; then
# function set_win_title(){
	# echo -ne "\033]0; ~/$(basename "$PWD") \007"
 # }

# precmd_functions+=(set_win_title)
fi

