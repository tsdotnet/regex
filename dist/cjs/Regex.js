"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.Group = exports.Capture = exports.Regex = exports.RegexOptions = void 0;
const EMPTY = '', _I = 'i', _M = 'm', _W = 'w';
var RegexOptions;
(function (RegexOptions) {
    RegexOptions["IgnoreCase"] = "i";
    RegexOptions["MultiLine"] = "m";
    RegexOptions["Unicode"] = "u";
    RegexOptions["Sticky"] = "y";
    RegexOptions["IgnorePatternWhitespace"] = "w";
})(RegexOptions || (exports.RegexOptions = RegexOptions = {}));
Object.freeze(RegexOptions);
class Regex {
    constructor(pattern, options, ...extra) {
        if (!pattern)
            throw new Error('\'pattern\' cannot be null or empty.');
        let patternString, flags = typeof options === 'string'
            ? (options + extra.join(EMPTY)).toLowerCase()
            : ((options && (options instanceof Array
                ? options
                : [options]).concat(extra)) || extra)
                .join(EMPTY)
                .toLowerCase();
        if (pattern instanceof RegExp) {
            const p = pattern;
            if (p.ignoreCase && flags.indexOf(_I) === -1)
                flags += _I;
            if (p.multiline && flags.indexOf(_M) === -1)
                flags += _M;
            patternString = p.source;
        }
        else {
            patternString = pattern;
        }
        const ignoreWhiteSpace = flags.indexOf(_W) !== -1;
        flags = flags.replace(/[gw]/g, EMPTY);
        const keys = [];
        {
            const k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (let i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
                patternString = patternString.replace(/\?<\w+>/g, EMPTY);
                this._keys = keys;
            }
            if (ignoreWhiteSpace)
                patternString = patternString.replace(/\s+/g, '\\s*');
            this._re = new RegExp(patternString, flags);
        }
        Object.freeze(this);
    }
    static isMatch(input, pattern, options) {
        const r = new Regex(pattern, options);
        return r.isMatch(input);
    }
    static replace(input, pattern, replacement, options) {
        const r = new Regex(pattern, options);
        return r.replace(input, replacement);
    }
    static escape(source) {
        return source.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    }
    match(input, startIndex = 0) {
        let r;
        if (!input || startIndex >= input.length || !(r = this._re.exec(input.substring(startIndex))))
            return Match.Empty;
        if (!(startIndex > 0))
            startIndex = 0;
        const first = startIndex + r.index, groups = [], groupMap = {};
        let loc = first;
        for (let i = 0, len = r.length; i < len; ++i) {
            const text = r[i];
            let g = EmptyGroup;
            if (text != null) {
                g = new Group(text, loc);
                g.freeze();
            }
            if (i && this._keys && i < this._keys.length)
                groupMap[this._keys[i]] = g;
            groups.push(g);
            if (text && i !== 0)
                loc += text.length;
        }
        const m = new Match(r[0], first, groups, groupMap);
        m.freeze();
        return m;
    }
    matches(input) {
        const matches = [];
        let m, p = 0;
        const end = (input && input.length) || 0;
        while (p < end && (m = this.match(input, p)) && m.success) {
            matches.push(m);
            p = m.index + m.length;
        }
        return Object.freeze(matches);
    }
    replace(input, replacement, count = Infinity) {
        if (!input || replacement == null || !(count > 0))
            return input;
        const result = [];
        let p = 0;
        const end = input.length, isEvaluator = typeof replacement === 'function';
        let m, i = 0;
        while (i < count && p < end && (m = this.match(input, p)) && m.success) {
            const index = m.index, length = m.length;
            if (p !== index)
                result.push(input.substring(p, index));
            result.push(isEvaluator ? replacement(m, i++) : replacement);
            p = index + length;
        }
        if (p < end)
            result.push(input.substring(p));
        return result.join(EMPTY);
    }
    isMatch(input) {
        return this._re.test(input);
    }
}
exports.Regex = Regex;
class Capture {
    constructor(value = EMPTY, index = -1) {
        this.value = value;
        this.index = index;
    }
    get length() {
        const v = this.value;
        return (v && v.length) || 0;
    }
    freeze() {
        Object.freeze(this);
    }
}
exports.Capture = Capture;
class Group extends Capture {
    constructor(value = EMPTY, index = -1) {
        super(value, index);
    }
    static get Empty() {
        return EmptyGroup;
    }
    get success() {
        return this.index !== -1;
    }
}
exports.Group = Group;
const EmptyGroup = new Group();
EmptyGroup.freeze();
class Match extends Group {
    constructor(value = EMPTY, index = -1, groups = [], namedGroups = {}) {
        super(value, index);
        this.groups = groups;
        this.namedGroups = namedGroups;
    }
    static get Empty() {
        return EmptyMatch;
    }
    freeze() {
        if (!this.groups)
            throw new Error('\'groups\' cannot be null.');
        if (!this.namedGroups)
            throw new Error('\'groupMap\' cannot be null.');
        Object.freeze(this.groups);
        Object.freeze(this.namedGroups);
        super.freeze();
    }
}
exports.Match = Match;
const EmptyMatch = new Match();
EmptyMatch.freeze();
exports.default = Regex;
//# sourceMappingURL=Regex.js.map