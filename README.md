# ハタヤマ
[![Website]][2]
[![Heroku]][8]

Derived from the reading of 「<ruby>旗<rt>hata</rt>の<rt>no</rt>山<rt>yama</rt></ruby>」

## Installing
[![GitHub Release]][3]
[![Github Downloads]][3]

- Download the [latest release][3]
- Extract the zip
- Upload to your server


## Development
[![Travis]][0]
[![CircleCI]][1]
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
See [Changelog][7]

[Travis]: https://img.shields.io/travis/wopian/hatayama.svg?style=flat-square&label=travis
[CircleCI]: https://img.shields.io/circleci/project/github/wopian/hatayama/master.svg?style=flat-square&label=circleci
[Website]: https://img.shields.io/website-up-down-green-red/https/hatayama.wopian.me.svg?style=flat-square
[Heroku]: https://img.shields.io/website-up-down-green-red/https/hatayama.herokuapp.com.svg?style=flat-square&label=heroku
[GitHub Release]: https://img.shields.io/github/release/wopian/hatayama.svg?style=flat-square
[GitHub Downloads]: https://img.shields.io/github/downloads/wopian/hatayama/total.svg?style=flat-square
[Code Climate Score]: https://img.shields.io/codeclimate/github/wopian/hatayama.svg?style=flat-square
[Code Climate Issues]: https://img.shields.io/codeclimate/issues/github/wopian/hatayama.svg?style=flat-square
[CodeCov]: https://img.shields.io/codecov/c/github/wopian/hatayama.svg?style=flat-square

[0]: https://travis-ci.org/wopian/hatayama
[1]: https://circleci.com/gh/wopian/hatayama/tree/master
[2]: https://hatayama.wopian.me
[3]: https://github.com/wopian/hatayama/releases
[4]: https://codeclimate.com/github/wopian/hatayama
[5]: https://codeclimate.com/github/wopian/hatayama/issues
[6]: https://codecov.io/gh/wopian/hatayama
[7]: https://github.com/wopian/hatayama/blob/master/CHANGELOG.md
[8]: https://hatayama.herokuapp.com