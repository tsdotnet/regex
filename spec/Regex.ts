import Regex, { Match } from '../src/Regex';

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regex = new Regex('(?<' + 'first>[A-E]+)', ['i']);
//noinspection JSUnusedLocalSymbols
const regex2 = new Regex(/([A-E]+)/im);
//noinspection JSUnusedLocalSymbols
const regex3 = new Regex(/([A-E]+)/);
// noinspection RegExpRepeatedSpace
const regex4 = new Regex(/A	B C D  E/, 'i', 'w');
const pattern = '([A-E]+)';

describe('Regex', () => {
	describe('new', () => {
		it('should throw', () => {
			expect(() => new Regex(null as any)).toThrow();
		});
	});

	describe('.isMatch(input)', () => {
		it('should indicate true for match', () => {
			expect(regex.isMatch(str)).toBeTrue();
			expect(Regex.isMatch(str, pattern, ['i'])).toBeTrue();
		});

		it('should indicate false for non-match', () => {
			expect(!regex.isMatch('ZYXWV')).toBeTrue();
			expect(!Regex.isMatch('ZYXWV', pattern, ['i'])).toBeTrue();
		});
	});

	describe('.match(input)', () => {
		it('should match correctly', () => {
			let m = regex.match(str);
			expect(m.value).toBe('ABCDE');
			expect(m.index).toBe(0);
			expect(m.namedGroups.first.value).toBe('ABCDE');

			m = regex.match(str, 20);
			expect(m.value).toBe('abcde');
			expect(m.index).toBe(26);
			expect(m.namedGroups.first.value).toBe('abcde');
		});
	});

	describe('.matches(input)', () => {
		it('should capture all instances', () => {
			function check(m: readonly Match[]): void {
				expect(m.length).toBe(2);
				expect(m[0].value).toBe('ABCDE');
				expect(m[0].index).toBe(0);
				expect(m[1].value).toBe('abcde');
				expect(m[1].index).toBe(26);
			}
			check(regex.matches(str));
			check(regex4.matches(str));
		});
	});

	describe('.replace(input, x)', () => {
		it('should replace requested instances', () => {
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, 'XXX')).toBe('XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz');
			expect(Regex.replace(str, pattern, 'XXX', ['i'])).toBe('XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz');
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, '')).toBe('FGHIJKLMNOPQRSTUVWXYZfghijklmnopqrstuvwxyz');
			expect(regex.replace(str, null as any)).toBe(str);
			//noinspection SpellCheckingInspection
			expect(regex.replace(str, () => '*')).toBe('*FGHIJKLMNOPQRSTUVWXYZ*fghijklmnopqrstuvwxyz');
			expect(regex.replace(str, (x) => x.value + '*')).toBe(
				'ABCDE*FGHIJKLMNOPQRSTUVWXYZabcde*fghijklmnopqrstuvwxyz',
			);
			expect(regex.replace(str, (x, i) => i)).toBe('0FGHIJKLMNOPQRSTUVWXYZ1fghijklmnopqrstuvwxyz');
		});
	});
});
