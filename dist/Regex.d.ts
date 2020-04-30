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
    replace(input: string, r: Primitive | SelectorWithIndex<Match, Primitive>, count?: number): string;
    isMatch(input: string): boolean;
    static isMatch(input: string, pattern: string, options?: RegexOptionsParam): boolean;
    static replace(input: string, pattern: string, e: Primitive | SelectorWithIndex<Match, Primitive>, options?: RegexOptionsParam): string;
}
export declare class Capture {
    readonly value: string;
    readonly index: number;
    get length(): number;
    constructor(value?: string, index?: number);
    freeze(): void;
}
export declare class Group extends Capture {
    get success(): boolean;
    constructor(value?: string, index?: number);
    static get Empty(): Group;
}
export declare class Match extends Group {
    readonly groups: Group[];
    readonly namedGroups: Map<Group>;
    constructor(value?: string, index?: number, groups?: Group[], namedGroups?: Map<Group>);
    freeze(): void;
    static get Empty(): Match;
}
export default Regex;
