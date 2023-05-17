# Demo

## Install

```bash
$ yarn
```

## run

create .env file

```bash
# demo is first level directory in packages
# this config will start video-payer demo
demo=video-player
```

start demo

```bash
$ yarn start
```

## demos

### HLS 视频播放器

> HLS (HTTP Live Streaming)

通过URL参数传入播放地址
[跳转播放](https://mrtujiawei.github.io/package/video-player/index.html)

> example

```
https://mrtujiawei.github.io/package/video-player/index.html?playURL=${*.m3u8}
```
