<a href="https://tsdotnet.github.io/regex/"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/regex@master/assets/banner.svg" alt="@tsdotnet/regex: Regex, the .NET way. Matches, groups and named groups."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/regex.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/regex)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/regex/blob/master/LICENSE)

A `Regex` class modelled on .NET's: matches, groups, named groups, replace with evaluators.

## Install

```sh
npm install @tsdotnet/regex
```

## Usage

```ts
import { Regex } from '@tsdotnet/regex';

const re = new Regex('(?<year>\\d{4})-(?<month>\\d{2})');
const m = re.match('Released 2026-11-20');
m.success;                     // true
m.namedGroups['year']?.value;  // '2026'
re.matches('2026-11, 2027-01').length; // 2
```

Also `replace` (with a string or a function), `isMatch`, and static `Regex.escape`.

## Use it from

ESM (`import { Regex } from '@tsdotnet/regex';`) or CommonJS (`const { Regex } = require('@tsdotnet/regex');`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/regex@1/dist/umd/regex.min.js"></script>
<script>
  const { Regex } = tsdotnet.regex;
</script>
```

</details>

## Docs

[tsdotnet.github.io/regex](https://tsdotnet.github.io/regex/)
