![npm version](https://img.shields.io/npm/v/flowtime)
![bundle size](https://img.shields.io/bundlephobia/minzip/flowtime)

# flowtime CLI

flowtime is an art project and thought experiment that challenges and reimagines our traditional understanding of time.

This package is a C implementation that contains a command line tool to show the current flowtime.

Find more details on the [flowtime official page](1).

## Install

With brew on MacOS

```
brew install ucodia/tools/flowtime
```

## Usage

```
flowtime - Display time in flowtime format

Usage:
  flowtime [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version information
  -c, --clock    Run in continuous clock mode
```

## Build

Build the program

```bash
mkdir -p bin
gcc main.c flowtime.c -o bin/flowtime
```

Run the program

```bash
bin/flowtime -c
```

## Test

Build unit tests

```bash
gcc test.c flowtime.c -o bin/test
```

Run the tests with JavaScript test cases

```bash
bin/test ../flowtime-js/test_data.csv
```

## License

This package is MIT licensed. See [LICENSE](LICENSE).

[1]: https://ucodia.space/flowtime