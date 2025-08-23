/* eslint-disable no-regex-spaces,no-control-regex */
import { describe, it, expect } from 'vitest';
import Regex, {Match, Group} from '../src/Regex';

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regex = new Regex('(?<' + 'first>[A-E]+)', ['i']);
// noinspection RegExpRepeatedSpace
const regex4 = new Regex(/A	B C D  E/, 'i', 'w');
const pattern = '([A-E]+)';

// Just runtime checks.
//noinspection JSUnusedLocalSymbols
// const
// 	regex2 = new Regex(/([A-E]+)/im),
// 	regex3 = new Regex(/([A-E]+)/);

describe('Regex', () => {
	describe('new', () => {
		it('should throw', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(() => new Regex(null as any)).toThrow();
		});
	});

	describe('.isMatch(input)', () => {
		it('should indicate true for match', () => {
			expect(regex.isMatch(str)).toBe(true);
			expect(Regex.isMatch(str, pattern, ['i'])).toBe(true);
		});

		it('should indicate false for non-match', () => {
			expect(!regex.isMatch('ZYXWV')).toBe(true);
			expect(!Regex.isMatch('ZYXWV', pattern, ['i'])).toBe(true);
		});
	});

	describe('.match(input)', () => {
		it('should match correctly', () => {
			let m = regex.match(str);
			expect(m.value).equal('ABCDE');
			expect(m.index).equal(0);
			const firstGroup = m.namedGroups.first;
			expect(firstGroup).toBeDefined();
			expect(firstGroup?.value).equal('ABCDE');

			m = regex.match(str, 20);
			expect(m.value).equal('abcde');
			expect(m.index).equal(26);
			const firstGroupSecond = m.namedGroups.first;
			expect(firstGroupSecond).toBeDefined();
			expect(firstGroupSecond?.value).equal('abcde');
		});
	});

	describe('.matches(input)', () => {
		it('should capture all instances', () => {
		function check (m: readonly Match[]): void
		{
			expect(m.length).equal(2);
			const firstMatch = m[0];
			const secondMatch = m[1];
			expect(firstMatch).toBeDefined();
			expect(secondMatch).toBeDefined();
			expect(firstMatch?.value).equal('ABCDE');
			expect(firstMatch?.index).equal(0);
			expect(secondMatch?.value).equal('abcde');
			expect(secondMatch?.index).equal(26);
		}			check(regex.matches(str));
			check(regex4.matches(str));
		});
	});

	describe('.replace(input, x)', () => {
		it('should replace requested instances', () => {
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, 'XXX')).equal('XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz');
			expect(Regex.replace(str, pattern, 'XXX', ['i'])).equal('XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz');
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, '')).equal('FGHIJKLMNOPQRSTUVWXYZfghijklmnopqrstuvwxyz');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(regex.replace(str, null as any)).equal(str);
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, () => '*')).equal('*FGHIJKLMNOPQRSTUVWXYZ*fghijklmnopqrstuvwxyz');
			expect(regex.replace(str, x => x.value + '*')).equal(
				'ABCDE*FGHIJKLMNOPQRSTUVWXYZabcde*fghijklmnopqrstuvwxyz'
			);
			expect(regex.replace(str, (
				x,
				i) => i)).equal('0FGHIJKLMNOPQRSTUVWXYZ1fghijklmnopqrstuvwxyz');
		});
	});

	describe('static methods', () => {
		it('should escape special regex characters', () => {
			// Test the Regex.escape static method (lines 148-150)
			expect(Regex.escape('hello')).toBe('hello');
			expect(Regex.escape('hello.world')).toBe('hello\\.world');
			expect(Regex.escape('test[123]')).toBe('test\\[123\\]');
			expect(Regex.escape('path/to/file')).toBe('path\\/to\\/file');
			expect(Regex.escape('braces{1,2}')).toBe('braces\\{1,2\\}');
			expect(Regex.escape('parentheses(group)')).toBe('parentheses\\(group\\)');
			expect(Regex.escape('asterisk*plus+')).toBe('asterisk\\*plus\\+');
			expect(Regex.escape('question?')).toBe('question\\?');
			expect(Regex.escape('backslash\\n')).toBe('backslash\\\\n');
			expect(Regex.escape('caret^dollar$')).toBe('caret\\^dollar\\$');
			expect(Regex.escape('pipe|or')).toBe('pipe\\|or');
			
			// Test all special characters together
			const specialChars = '-[]/{}()*+?.\\^$|';
			const escaped = Regex.escape(specialChars);
			expect(escaped).toBe('\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|');
			
			// Test that escaped strings work in actual regex
			const testStr = 'special.chars[here]';
			const escapedPattern = Regex.escape(testStr);
			const regex = new Regex(escapedPattern);
			expect(regex.isMatch(testStr)).toBe(true);
			expect(regex.isMatch('special-chars-here-')).toBe(false);
		});
	});

	describe('Group class', () => {
		it('should provide Empty static property', () => {
			// Test the Group.Empty static getter (lines 280-282)
			const emptyGroup = Group.Empty;
			expect(emptyGroup).toBeDefined();
			expect(emptyGroup.value).toBe('');
			expect(emptyGroup.index).toBe(-1);
			expect(emptyGroup.success).toBe(false);
			
			// Verify it's always the same instance
			const emptyGroup2 = Group.Empty;
			expect(emptyGroup).toBe(emptyGroup2);
			
			// Test that it's frozen (immutable)
			expect(() => {
				(emptyGroup as any).value = 'test';
			}).toThrow();
		});

		it('should have success property based on index', () => {
			const successfulGroup = new Group('match', 5);
			expect(successfulGroup.success).toBe(true);
			
			const failedGroup = new Group('', -1);
			expect(failedGroup.success).toBe(false);
			
			const zeroIndexGroup = new Group('match', 0);
			expect(zeroIndexGroup.success).toBe(true);
		});
	});
});
