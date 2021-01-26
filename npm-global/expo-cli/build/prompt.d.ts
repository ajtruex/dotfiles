import inquirer, { ChoiceType, Question } from 'inquirer';
export { Question, ChoiceType };
declare type CliQuestions = Question | Question[];
/** @deprecated this prompt is now deprecated in favor of ./prompts */
declare function prompt(questions: CliQuestions, { nonInteractiveHelp }?: {
    nonInteractiveHelp?: string;
}): any;
declare namespace prompt {
    var separator: (...args: any[]) => inquirer.objects.Separator;
}
export default prompt;
