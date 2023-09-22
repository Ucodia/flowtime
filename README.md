# ~ flowtime ~

`flowtime` is an unpredictable time library for JavaScript that computes the *flow time*.

Like the *common time*, it has 24 hours per day and 60 minutes per hour, but the order in which the hours and minutes occur is unpredictable, yet universal.

See it in action at [ucodia.space](https://ucodia.space/flowtime) 🚀

## What is the flow time?

The *flow time* is an expression of the timelessness of [flow states](1). It is a *thought experiment* around our relationship with time, attempting to recall those moments of perfect focus where time dissolves and becomes meaningless.

It was designed to have the following properties:
- Unpredictable: based on pseudo-random generators, Human beings cannot predict the sequence of *flow time*
- Universal: computed from the date and the *common time*, 6 o'clock in Paris yields the same *flow time* at 6 o'clock in New York on the same day

As with *common time*, hour changes every 60 minutes and minutes changes every 60 seconds but they come in an unpredictable order (e.g. 22, 7, 13, 10, ...). Though seconds are just working in the usual predictable order.

## Installation

### With npm

Install the library.

```bash
npm i flowtime
```

To import in a Node.js app, do the usual.

```js
const flowtime = require('flowtime')
```

To import in a JavaScript app with a module bundler, do the usual.

```js
import { fromDate } from 'flowtime'
```

### In the browser

To use in a web page with traditional script loading, you can import the script directly from a CDN like [UNPKG](https://unpkg.com). The library will be available through the `window.flowtime` object.

```html
<script src="https://unpkg.com/flowtime"></script>
```

## Usage

The library exposes two functions, `fromNow` which returns the current flow time, and `fromDate` which takes a JavaScript `Date` as argument to return its corresponding flow time.

```js
import { fromDate } from 'flowtime'

const now = new Date()
console.log(now)
// Sat Jul 21 2018 14:52:42 GMT-0700 (Pacific Daylight Time)

const time = fromDate(now)
console.log(time)
// {hour: 1, minute: 28, second: 42, toDate: ƒ}
```

The flow time object also exposes a `toDate` function that returns a JavaScript `Date` adjusted to *flow time*.

```js
console.log(time.toDate())
// Sat Jul 21 2018 01:28:42 GMT-0700 (Pacific Daylight Time)
```

## Algorithm

The only inputs for computing the *flow time* are the date and the *common time*.

To guarantee the *flow time* to be unpredictable by Human beings but at the same time universal, pseudo-random number generators (PRNG) were a perfect fit. It can produce long series of numbers before repeating the same sequence (period) which can be reproduced over and over by using the same parameters. The PRNG calculation is hard enough for humans to be able to compute without a calculator and uses different generators for computing hours and minutes, thus making it nearly impossbile to predict.

In order to compute the same *flow time* universally, it is required to *seed* the random number generators for hours and minutes with an identifier unique to that time period. For example, to generate the sequence of hours for a day, we need to identify that day uniquely and use that as a seed for the hours PRNG of that day. Same principle applies to generate the sequence of minutes for an hour. By identifying time periods uniquely, *flow time* computation is universal all while guaranteeing a new unpredictable sequence of hours and minutes every day.

### Pseudo-random number generator (PRNG)

The PRNG used for generating the hours and minutes sequence has the following constraints:
- Can be initialized with a seed
- Should generate a sequence unique to a seed
- Sequence distribution should be normal
- Sequence period should be at least 100 (compatible with millisecond)

Two different PRNG are required, one to generate the hours sequence and one to generate the minutes sequence. The following [linear congruential generators](2) (LCG) are used to fit those constraints:

- Hours: LCG with values <code>m=2<sup>32</sup></code>, `a=1664525` and `c=1013904223`, as provided in the [Numerical Recipes](3) book
- Minutes: LCG with values <code>m=2<sup>31</sup>-1</code>, `a=48271` and `c=0`, as provided in the MINSTD original [Lehmer PRNG](4)

### Identification of time periods

A time period can be uniquely identified by assembling numerical values from the date and *common time*. For example, if the date is `July 21, 2018` and the *common time* is `01:28:42`, the day can be uniquely identified by `20180721` and the hour by `2018072101`, which can then *seed* respectively the hour PRNG and the minute PRNG to compute the *flow time* for that date and time.

### Walkthrough

See a walkthrough at [RunKit](https://runkit.com/ucodia/flowtime-algorithm-walkthrough).

## References

- [Flow](1) on Wikipedia
- [Linear congruential generator](2) on Wikipedia
- [Numerical Recipes](3) on Wikipedia
- [Lehmer PRNG](4) on Wikipedia

## License

`flowtime` is MIT licensed. See [LICENSE](LICENSE)

[1]: https://en.wikipedia.org/wiki/Flow_(psychology)
[2]: https://en.wikipedia.org/wiki/Linear_congruential_generator
[3]: https://en.wikipedia.org/wiki/Numerical_Recipes
[4]: https://en.wikipedia.org/wiki/Lehmer_random_number_generator