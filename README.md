# ハタヤマ
Derived from the reading of 「<ruby>旗<rt>hata</rt>の<rt>no</rt>山<rt>yama</rt></ruby>」

## Development
[![CircleCI]][1]
[![Website]][2]
[![GitHub Release]][3]
[![Code Climate Score]][4]
[![Code Climate Issues]][5]
[![CodeCov]][6]

### Setup
```bash
# Check you're using NodeJS 7.0.0 or above
node -v
# Check you're using npm 4.0.0 or above
npm -v
# Download source code
git clone https://github.com/wopian/hatayama.git
cd hatayama
# Install dependencies
npm i
```

### Building
```bash
# Build and watch for changes
gulp watch
# Build
gulp
```

### Testing
```bash
gulp test
```

### Updating
```bash
npm update && npm prune
```

## Known Issues
No known issues

## Releases
See [Changelog][0]

[CircleCI]: https://img.shields.io/circleci/project/github/wopian/hatayama/master.svg?style=flat-square
[Website]: https://img.shields.io/website-up-down-green-red/https/hatayama.wopian.me.svg
[GitHub Release]: https://img.shields.io/github/release/wopian/hatayama.svg
[Code Climate Score]: https://img.shields.io/codeclimate/github/wopian/hatayama.svg
[Code Climate Issues]: https://img.shields.io/codeclimate/issues/github/wopian/hatayama.svg
[CodeCov]: https://img.shields.io/codecov/c/github/wopian/hatayama.svg

[0]: https://github.com/wopian/hatayama/blob/master/CHANGELOG.md
[1]: https://circleci.com/gh/wopian/hatayama/tree/master
[2]: https://hatayama.wopian.me
[3]: https://github.com/wopian/hatayama/releases
[4]: https://codeclimate.com/github/wopian/hatayama
[5]: https://codeclimate.com/github/wopian/hatayama/issues
[6]: https://codecov.io/gh/wopian/hatayama
