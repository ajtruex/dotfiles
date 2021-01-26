#PROMPT='$fg[green]%n@$fg[green]%m: $fg[green]%1$ %{$reset_color%}%c%c%c'
# #RPROMPT='[%F{yellow}%?%f]'
# git_prompt() {
#  ref=$(git symbolic-ref HEAD | cut -d'/' -f3)
#  echo $ref
# }
# PROMPT='%F{green}%n@%m: %~ %F{magenta}%$(git_prompt)$ %{$reset_color%}'
# setopt prompt_subst
# PS1=$(git_prompt)%#
# autoload -U promptinit
# promptinit
# if [ -z __git_ps1 ]; then
    # setopt PROMPT_SUBST ; PS1='%F{green}%n@%m: %~$%F{magenta}%$(__git_ps1 "  (%s)")\$ %{$reset_color%}'
# else
    # setopt PROMPT_SUBST ; PS1='%F{green}%n@%m: %~%F{magenta}%$(__git_ps1 "  (%s)")\$ %{$reset_color%}'
# fi

# if [ -n __git_ps1 ]
# then setopt PROMPT_SUBST ; PS1='%F{green}%n@%m: %~%F{magenta}%$(__git_ps1 "  (%s)")\$ %{$reset_color%}'
# echo $PS1
# else setopt PROMPT_SUBST ; PS1='%F{green}%n@%m: %~$%F{magenta}%$(__git_ps1 "  (%s)")\$ %{$reset_color%}'
# echo $PS1
# fi

setopt PROMPT_SUBST ; PS1='%F{green}$(virtualenv_prompt_info)%n@%m: %~%F{magenta}%$(__git_ps1 "  (%s)")\$ %{$reset_color%}'