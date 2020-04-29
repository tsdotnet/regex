"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var EMPTY = '';
var _I = 'i', _M = 'm', _W = 'w';
var RegexOptions;
(function (RegexOptions) {
    RegexOptions["IgnoreCase"] = "i";
    RegexOptions["MultiLine"] = "m";
    RegexOptions["Unicode"] = "u";
    RegexOptions["Sticky"] = "y";
    RegexOptions["IgnorePatternWhitespace"] = "w";
})(RegexOptions = exports.RegexOptions || (exports.RegexOptions = {}));
Object.freeze(RegexOptions);
var Regex = /** @class */ (function () {
    function Regex(pattern, options) {
        var extra = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            extra[_i - 2] = arguments[_i];
        }
        if (!pattern)
            throw new Error("'pattern' cannot be null or empty.");
        var patternString, flags = typeof options === 'string'
            ? (options + extra.join(EMPTY)).toLowerCase()
            : ((options && (options instanceof Array ? options : [options]).concat(extra)) || extra)
                .join(EMPTY)
                .toLowerCase();
        if (pattern instanceof RegExp) {
            var p = pattern;
            if (p.ignoreCase && flags.indexOf(_I) === -1)
                flags += _I;
            if (p.multiline && flags.indexOf(_M) === -1)
                flags += _M;
            patternString = p.source;
        }
        else {
            patternString = pattern;
        }
        var ignoreWhiteSpace = flags.indexOf(_W) !== -1;
        // For the majority of expected behavior, we need to eliminate global and whitespace ignore.
        flags = flags.replace(/[gw]/g, EMPTY);
        // find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
        var keys = [];
        {
            var k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (var i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
                // remove keys from regexp leaving standard regexp
                patternString = patternString.replace(/\?<\w+>/g, EMPTY);
                this._keys = keys;
            }
            if (ignoreWhiteSpace)
                patternString = patternString.replace(/\s+/g, '\\s*');
            this._re = new RegExp(patternString, flags);
        }
        Object.freeze(this);
    }
    Regex.prototype.match = function (input, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var _ = this;
        var r;
        // tslint:disable-next-line:no-conditional-assignment
        if (!input || startIndex >= input.length || !(r = this._re.exec(input.substring(startIndex))))
            return Match.Empty;
        if (!(startIndex > 0))
            startIndex = 0;
        var first = startIndex + r.index;
        var loc = first;
        var groups = [], groupMap = {};
        for (var i = 0, len = r.length; i < len; ++i) {
            var text = r[i];
            var g = EmptyGroup;
            if (text != null) {
                // Empty string might mean \b match or similar.
                g = new Group(text, loc);
                g.freeze();
            }
            if (i && _._keys && i < _._keys.length)
                groupMap[_._keys[i]] = g;
            groups.push(g);
            if (text && i !== 0)
                loc += text.length;
        }
        var m = new Match(r[0], first, groups, groupMap);
        m.freeze();
        return m;
    };
    Regex.prototype.matches = function (input) {
        var matches = [];
        var m, p = 0;
        var end = (input && input.length) || 0;
        // tslint:disable-next-line:no-conditional-assignment
        while (p < end && (m = this.match(input, p)) && m.success) {
            matches.push(m);
            p = m.index + m.length;
        }
        return Object.freeze(matches);
    };
    Regex.prototype.replace = function (input, r, count) {
        if (count === void 0) { count = Infinity; }
        if (!input || r == null || !(count > 0))
            return input;
        var result = [];
        var p = 0;
        var end = input.length, isEvaluator = typeof r === 'function';
        var m, i = 0;
        // tslint:disable-next-line:no-conditional-assignment
        while (i < count && p < end && (m = this.match(input, p)) && m.success) {
            var index = m.index, length_1 = m.length;
            if (p !== index)
                result.push(input.substring(p, index));
            result.push(isEvaluator ? r(m, i++) : r);
            p = index + length_1;
        }
        if (p < end)
            result.push(input.substring(p));
        return result.join(EMPTY);
    };
    Regex.prototype.isMatch = function (input) {
        return this._re.test(input);
    };
    Regex.isMatch = function (input, pattern, options) {
        var r = new Regex(pattern, options);
        return r.isMatch(input);
    };
    Regex.replace = function (input, pattern, e, options) {
        var r = new Regex(pattern, options);
        return r.replace(input, e);
    };
    return Regex;
}());
exports.Regex = Regex;
var Capture = /** @class */ (function () {
    function Capture(value, index) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        this.value = value;
        this.index = index;
    }
    Object.defineProperty(Capture.prototype, "length", {
        get: function () {
            var v = this.value;
            return (v && v.length) || 0;
        },
        enumerable: true,
        configurable: true
    });
    Capture.prototype.freeze = function () {
        Object.freeze(this);
    };
    return Capture;
}());
exports.Capture = Capture;
var Group = /** @class */ (function (_super) {
    tslib_1.__extends(Group, _super);
    function Group(value, index) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        return _super.call(this, value, index) || this;
    }
    Object.defineProperty(Group.prototype, "success", {
        get: function () {
            return this.index !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group, "Empty", {
        get: function () {
            return EmptyGroup;
        },
        enumerable: true,
        configurable: true
    });
    return Group;
}(Capture));
exports.Group = Group;
var EmptyGroup = new Group();
EmptyGroup.freeze();
var Match = /** @class */ (function (_super) {
    tslib_1.__extends(Match, _super);
    function Match(value, index, groups, namedGroups) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        if (groups === void 0) { groups = []; }
        if (namedGroups === void 0) { namedGroups = {}; }
        var _this = _super.call(this, value, index) || this;
        _this.groups = groups;
        _this.namedGroups = namedGroups;
        return _this;
    }
    Match.prototype.freeze = function () {
        if (!this.groups)
            throw new Error("'groups' cannot be null.");
        if (!this.namedGroups)
            throw new Error("'groupMap' cannot be null.");
        Object.freeze(this.groups);
        Object.freeze(this.namedGroups);
        _super.prototype.freeze.call(this);
    };
    Object.defineProperty(Match, "Empty", {
        get: function () {
            return EmptyMatch;
        },
        enumerable: true,
        configurable: true
    });
    return Match;
}(Group));
exports.Match = Match;
var EmptyMatch = new Match();
EmptyMatch.freeze();
exports.default = Regex;
//# sourceMappingURL=Regex.js.map