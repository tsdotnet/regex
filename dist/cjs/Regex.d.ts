/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT
 */
import { Primitive, SelectorWithIndex } from '@tsdotnet/common-interfaces';
export type RegexOptionsLiteral = RegexOptions.IgnoreCase | 'i' | 'I' | RegexOptions.MultiLine | 'm' | 'M' | RegexOptions.Unicode | 'u' | 'U' | RegexOptions.Sticky | 'y' | 'Y' | RegexOptions.IgnorePatternWhitespace | 'w' | 'W';
export declare enum RegexOptions {
    IgnoreCase = "i",
    MultiLine = "m",
    Unicode = "u",
    Sticky = "y",
    IgnorePatternWhitespace = "w"
}
export type RegexOptionValues = RegexOptions | RegexOptionsLiteral;
export type RegexOptionsParam = RegexOptionValues | RegexOptionValues[] | string;
export declare class Regex {
    private readonly _re;
    private readonly _keys;
    constructor(pattern: string | RegExp, options?: RegexOptionsParam, ...extra: RegexOptionValues[]);
    static isMatch(input: string, pattern: string, options?: RegexOptionsParam): boolean;
    static replace(input: string, pattern: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, options?: RegexOptionsParam): string;
    static escape(source: string): string;
    match(input: string, startIndex?: number): Match;
    matches(input: string): readonly Match[];
    replace(input: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, count?: number): string;
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
    readonly namedGroups: {
        [key: string]: Group;
    };
    constructor(value?: string, index?: number, groups?: Group[], namedGroups?: {
        [key: string]: Group;
    });
    static get Empty(): Match;
    freeze(): void;
}
export default Regex;
