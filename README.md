# rc-gusture-unlock
react component used in mobile

<!-- [![NPM version][npm-image]][npm-url] [![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi) [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/rc-gusture-unlock.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-gusture-unlock
[github-actions-image]: https://github.com/react-component/textarea/workflows/CI/badge.svg
[github-actions-url]: https://github.com/react-component/textarea/actions
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/textarea/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/textarea/branch/master
[download-image]: https://img.shields.io/npm/dm/rc-gusture-unlock.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-gusture-unlock
[bundlephobia-url]: https://bundlephobia.com/result?p=rc-gusture-unlock
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/rc-gusture-unlock
 -->
## Live Demo

https://codesandbox.io/s/magical-robinson-roh9hz

## Install

[![rc-gusture-unlock](https://nodei.co/npm/rc-gusture-unlock.png)](https://npmjs.org/package/rc-gusture-unlock)

## Usage

```js
import GustureLock from 'rc-gusture-unlock';
import { render } from 'react-dom';

render(<GustureLock />, mountNode);
```

## API

| Property     | Type                        | Default     | Description                                                                                    |
| ------------ | --------------------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| className    | string                      | ''          | additional class name of textarea                                                              |
| style        | React.CSSProperties         | -           | style properties of textarea                                                                   |
| callBack     | function(e)                 | -           | The callback function that is triggered when touchEnd is triggered                             |
| initColor    | string                      | '#A6A6A6'   | initial circle color                                                                           |
| initColor    | string                      | '#A6A6A6'   | initial circle color                                                                           |
| successColor | string                      | '#3a85ff'   | success color                                                                                  |
| errorColor   | string                      | 'red'       | error color                                                                                    |
| size         | number                      | 280         | component's width or height                                                                    |

## Methods

| Property     | params     | Description                                                                                    |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------- |
| success      | -          | show success status                                                                            |
| error        | -          | show error status                                                                              |
| reset        | -          | reset the component to initial stat                                                            |

## Development

```
npm install
npm start
```

## License

rc-gusture-unlock is released under the MIT license.
