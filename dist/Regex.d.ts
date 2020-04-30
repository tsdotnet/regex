/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT
 */
declare type Map<T> = {
    [key: string]: T;
};
declare type Primitive = string | number | boolean;
declare type SelectorWithIndex<TSource, TResult> = (source: TSource, index: number) => TResult;
/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
declare type RegexOptionsLiteral = RegexOptions.IgnoreCase | 'i' | 'I' | RegexOptions.MultiLine | 'm' | 'M' | RegexOptions.Unicode | 'u' | 'U' | RegexOptions.Sticky | 'y' | 'Y' | RegexOptions.IgnorePatternWhitespace | 'w' | 'W';
export declare enum RegexOptions {
    IgnoreCase = "i",
    MultiLine = "m",
    Unicode = "u",
    Sticky = "y",
    IgnorePatternWhitespace = "w"
}
declare type RegexOptionValues = RegexOptions | RegexOptionsLiteral;
declare type RegexOptionsParam = RegexOptionValues | RegexOptionValues[] | string;
export declare class Regex {
    private readonly _re;
    private readonly _keys;
    constructor(pattern: string | RegExp, options?: RegexOptionsParam, ...extra: RegexOptionValues[]);
    /**
     * Tests a string pattern using a Regex for evaluation.
     * @param input The input text to evaluate.
     * @param pattern The pattern to match.
     * @param options RegexOptions to use.
     */
    static isMatch(input: string, pattern: string, options?: RegexOptionsParam): boolean;
    /**
     * Replaces all instances of the pattern with the replacement.
     * @param input The input text to evaluate.
     * @param pattern The pattern to match.
     * @param replacement A primitive value or match evaluator to use for replacement.
     * @param options RegexOptions to use.
     */
    static replace(input: string, pattern: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, options?: RegexOptionsParam): string;
    /**
     * Escapes a RegExp sequence.
     * @param source
     * @returns {string}
     */
    static escape(source: string): string;
    /**
     * Searches an input string for a substring that matches a regular expression pattern and returns the first occurrence as a single Match object.
     * @param input
     * @param startIndex
     */
    match(input: string, startIndex?: number): Match;
    /**
     * Searches an input string for all occurrences of a regular expression and returns all the matches.
     * @param input
     */
    matches(input: string): readonly Match[];
    /**
     * Replaces all instances of the pattern with the replacement.
     * @param input The input text to evaluate.
     * @param replacement A primitive value or match evaluator to use for replacement.
     * @param count Optional limit for number of times to replace.
     */
    replace(input: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, count?: number): string;
    /**
     * Tests the input text for a match.
     * @param input The input text to evaluate.
     */
    isMatch(input: string): boolean;
}
export declare class Capture {
    readonly value: string;
    readonly index: number;
    constructor(value?: string, index?: number);
    get length(): number;
    freeze(): void;
}
export declare class Group extends Capture {
    constructor(value?: string, index?: number);
    static get Empty(): Group;
    get success(): boolean;
}
export declare class Match extends Group {
    readonly groups: Group[];
    readonly namedGroups: Map<Group>;
    constructor(value?: string, index?: number, groups?: Group[], namedGroups?: Map<Group>);
    static get Empty(): Match;
    freeze(): void;
}
export default Regex;
