![npm version](https://img.shields.io/npm/v/flowtime)
![bundle size](https://img.shields.io/bundlephobia/minzip/flowtime)

# flowtime for JavaScript

flowtime is an art project and thought experiment that challenges and reimagines our traditional understanding of time.

This package is a JavaScript implementation that contains the necessary functionality to convert the conventional time to flowtime.

Find more details on the [flowtime official page](1).

## Usage

Install the library from npm

```bash
npm i flowtime
```

Use the `fromDate` function to convert a JavaScript `Date` to a flowtime object

```js
import flowtime from 'flowtime'

const now = new Date()
console.log(now)
// Sat Jul 21 2018 09:28:42 GMT-0700 (Pacific Daylight Time)

const time = flowtime.fromDate(now)
console.log(time)
// {hour: 11, minute: 49, second: 42, date: Sat Jul 21 2018 11:49:42 GMT-0700 (Pacific Daylight Time)}
```

## License

This package is MIT licensed. See [LICENSE](LICENSE).

[1]: https://ucodia.space/flowtime