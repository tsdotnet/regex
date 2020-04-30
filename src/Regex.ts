/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT
 */

/* eslint-disable @typescript-eslint/no-use-before-define */

type Map<T> = { [key: string]: T };
type Primitive = string | number | boolean;
type SelectorWithIndex<TSource, TResult> = (source: TSource, index: number) => TResult;

const
	EMPTY = '',
	_I    = 'i',
	_M    = 'm',
	_W    = 'w';

/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */

type RegexOptionsLiteral =
	| RegexOptions.IgnoreCase
	| 'i'
	| 'I'
	| RegexOptions.MultiLine
	| 'm'
	| 'M'
	| RegexOptions.Unicode
	| 'u'
	| 'U'
	| RegexOptions.Sticky
	| 'y'
	| 'Y'
	| RegexOptions.IgnorePatternWhitespace
	| 'w'
	| 'W';

export enum RegexOptions
{
	IgnoreCase              = 'i',
	MultiLine               = 'm',
	Unicode                 = 'u',
	Sticky                  = 'y',
	IgnorePatternWhitespace = 'w',
}

Object.freeze(RegexOptions);

type RegexOptionValues = RegexOptions | RegexOptionsLiteral;
type RegexOptionsParam = RegexOptionValues | RegexOptionValues[] | string;

export class Regex
{
	private readonly _re: RegExp;
	private readonly _keys: string[] | undefined;

	constructor (
		pattern: string | RegExp,
		options?: RegexOptionsParam,
		...extra: RegexOptionValues[])
	{
		if(!pattern) throw new Error("'pattern' cannot be null or empty.");

		let patternString: string,
			flags =
				typeof options==='string'
					? (options + extra.join(EMPTY)).toLowerCase()
					: ((options && (options instanceof Array
					? options
					: [options]).concat(extra)) || extra)
					.join(EMPTY)
					.toLowerCase();

		if(pattern instanceof RegExp)
		{
			const p = pattern as RegExp;
			if(p.ignoreCase && flags.indexOf(_I)=== -1) flags += _I;
			if(p.multiline && flags.indexOf(_M)=== -1) flags += _M;
			patternString = p.source;
		}
		else
		{
			patternString = pattern;
		}
		const ignoreWhiteSpace = flags.indexOf(_W)!== -1;

		// For the majority of expected behavior, we need to eliminate global and whitespace ignore.
		flags = flags.replace(/[gw]/g, EMPTY);

		// find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
		const keys: string[] = [];
		{
			const k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
			if(k)
			{
				for(let i = 0, len = k.length; i<len; i++)
				{
					keys[i + 1] = k[i];
				}

				// remove keys from regexp leaving standard regexp
				patternString = patternString.replace(/\?<\w+>/g, EMPTY);
				this._keys = keys;
			}

			if(ignoreWhiteSpace) patternString = patternString.replace(/\s+/g, '\\s*');

			this._re = new RegExp(patternString, flags);
		}

		Object.freeze(this);
	}

	/**
	 * Searches an input string for a substring that matches a regular expression pattern and returns the first occurrence as a single Match object.
	 * @param input
	 * @param startIndex
	 */
	match (input: string, startIndex: number = 0): Match
	{
		let r: RegExpExecArray | null;
		// tslint:disable-next-line:no-conditional-assignment
		if(!input || startIndex>=input.length || !(r = this._re.exec(input.substring(startIndex))))
			return Match.Empty;
		if(!(startIndex>0)) startIndex = 0;

		const
			first = startIndex + r.index,
			groups   = [] as Group[],
			groupMap = {} as Map<Group>;

		let loc = first;
		for(let i = 0, len = r.length; i<len; ++i)
		{
			const text = r[i];
			let g = EmptyGroup;
			if(text!=null)
			{
				// Empty string might mean \b match or similar.
				g = new Group(text, loc);
				g.freeze();
			}
			if(i && this._keys && i<this._keys.length) groupMap[this._keys[i]] = g;
			groups.push(g);
			if(text && i!==0) loc += text.length;
		}

		const m = new Match(r[0], first, groups, groupMap);
		m.freeze();
		return m;
	}

	/**
	 * Searches an input string for all occurrences of a regular expression and returns all the matches.
	 * @param input
	 */
	matches (input: string): readonly Match[]
	{
		const matches: Match[] = [];
		let m: Match,
			p = 0;
		const end = (input && input.length) || 0;
		// tslint:disable-next-line:no-conditional-assignment
		while(p<end && (m = this.match(input, p)) && m.success)
		{
			matches.push(m);
			p = m.index + m.length;
		}
		return Object.freeze(matches);
	}

	/**
	 * Replaces all instances of the pattern with the replacement.
	 * @param input The input text to evaluate.
	 * @param replacement A primitive value or match evaluator to use for replacement. 
	 * @param options RegexOptions to use.
	 */
	replace (input: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, count: number = Infinity): string
	{
		if(!input || replacement==null || !(count>0)) return input;
		const result: string[] = [];
		let p = 0;
		const
			end         = input.length,
			isEvaluator = typeof replacement==='function';

		let m: Match,
			i = 0;

		// tslint:disable-next-line:no-conditional-assignment
		while(i<count && p<end && (m = this.match(input, p)) && m.success)
		{
			const index = m.index, length = m.length;
			if(p!==index) result.push(input.substring(p, index));
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore replacement is not easily resolved properly here.
			result.push(isEvaluator ? replacement(m, i++) : replacement);
			p = index + length;
		}

		if(p<end) result.push(input.substring(p));

		return result.join(EMPTY);
	}

	/**
	 * Tests the input text for a match.
	 * @param input The input text to evaluate.
	 */
	isMatch (input: string): boolean
	{
		return this._re.test(input);
	}

	/**
	 * Tests a string pattern using a Regex for evaluation.
	 * @param input The input text to evaluate.
	 * @param pattern The pattern to match.
	 * @param options RegexOptions to use.
	 */
	static isMatch (input: string, pattern: string, options?: RegexOptionsParam): boolean
	{
		const r = new Regex(pattern, options);
		return r.isMatch(input);
	}

	/**
	 * Replaces all instances of the pattern with the replacement.
	 * @param input The input text to evaluate.
	 * @param pattern The pattern to match.
	 * @param replacement A primitive value or match evaluator to use for replacement. 
	 * @param options RegexOptions to use.
	 */
	static replace (input: string, pattern: string, replacement: Primitive | SelectorWithIndex<Match, Primitive>, options?: RegexOptionsParam): string
	{
		const r = new Regex(pattern, options);
		return r.replace(input, replacement);
	}

	/**
	 * Escapes a RegExp sequence.
	 * @param source
	 * @returns {string}
	 */
	static escape(source: string): string {
		return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, '\\$&');
	}	
}

export class Capture
{
	get length (): number
	{
		const v = this.value;
		return (v && v.length) || 0;
	}

	constructor (public readonly value: string = EMPTY, public readonly index: number = -1) {}

	freeze (): void
	{
		Object.freeze(this);
	}
}

export class Group
	extends Capture
{
	get success (): boolean
	{
		return this.index!== -1;
	}

	constructor (value: string = EMPTY, index: number = -1)
	{
		super(value, index);
	}

	static get Empty (): Group
	{
		return EmptyGroup;
	}
}

const EmptyGroup = new Group();
EmptyGroup.freeze();

export class Match
	extends Group
{
	constructor (
		value: string                           = EMPTY,
		index: number                           = -1,
		public readonly groups: Group[]         = [],
		public readonly namedGroups: Map<Group> = {}
	)
	{
		super(value, index);
	}

	freeze (): void
	{
		if(!this.groups) throw new Error("'groups' cannot be null.");
		if(!this.namedGroups) throw new Error("'groupMap' cannot be null.");
		Object.freeze(this.groups);
		Object.freeze(this.namedGroups);
		super.freeze();
	}

	static get Empty (): Match
	{
		return EmptyMatch;
	}
}

const EmptyMatch = new Match();
EmptyMatch.freeze();

export default Regex;
