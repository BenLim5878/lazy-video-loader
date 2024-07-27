# Lazy Video Loader

LazyVideoLoader is a custom video element that enables loading of videos only when they are in view. This helps to save bandwidth and improve the performance of your web applications by deferring the loading of videos until they are needed.

## Description

The LazyVideoLoader custom HTML component is a lightweight solution (~1.8 KB) for lazy loading videos in your web applications. It leverages the Intersection Observer API to detect when the video element enters the viewport and then starts loading the video. The component supports a variety of attributes to customize its behavior.

## Benefits
Websites with heavy video content often struggle with slow load times and high data usage, leading to poor user experiences and frustration.
<br><br>
This library defers the loading of videos until they enter the viewport, ensuring faster initial page loads and saving bandwidth. This is particularly beneficial for users on mobile devices or with slower internet connections, as it reduces unnecessary data consumption. It also contributes with better SEO by minimizing memory usage even on devices with limited resources, as search engines favor quicker websites.
<br><br>



## Installation

You can install LazyVideoLoader via npm:

```bash
npm install lazy-video-loader
```

Or include it directly in your HTML via unpkg:

```html
<script src="https://unpkg.com/lazy-video-loader/lazy-video-loader-minified.js"></script>
```

## Attributes
* `width` : The width of the video element.
* `height` : The height of the video element.
* `controls` : Whether to display video controls. (true/false)
* `loop`: Whether to loop the video. (true/false)
* `playsinline` : Whether to play the video inline. (true/false)
* `margin` : A margin percentage to trigger the video load before it enters the viewport (See below for detailed explanation).
* `manual` : If set to true, the video will not automatically load when the viewport is in the `margin`. (true/false)

### Explanation of `margin`

A value of 0 means that the video will start loading exactly when the viewport passes the bounds of the container. Position values will start loading the video sooner, based on the percentage of the container's height. For example, a value of 0.5 means the video will start loading when the viewport is within half the height of the container above or below it

* `0`: The video will start loading exactly when the viewport reaches the bounds of the container.
* `0.1` : The video will start loading when the viewport is within 10% of the container's height from the top or bottom.
* `0.5` : The video will start loading when the viewport is within 50% of the container's height from the top or bottom.

By adjusting the margin attribute, you can control how early or late the video starts loading relative to its position in the viewport, providing flexibility for optimizing user experience and performance.

## Usage

### Example for implementing Lazy Loading

```html
<lazy-video-loader width="640" height="360" controls loop playsinline>
    <source src="path/to/your/video.mp4" type="video/mp4">
    <source src="path/to/your/video.webm" type="video/webm">
</lazy-video-loader>
```

### Example for implementing Manual Loading

```html
<lazy-video-loader width="640" height="360" controls loop playsinline manual margin="0.5">
    <source src="path/to/your/video.mp4" type="video/mp4">
</lazy-video-loader>

<script>
    const videoLoader = document.querySelector('lazy-video-loader');
    videoLoader.load();
</script>
```

### Example for implementing Custom Poster Image

This example sets a custom poster image for the video. The poster image will also be loaded based on the lazy loading logic, meaning it will only be fetched when the video element enters the viewport.

```html
<lazy-video-loader width="640" height="360" poster="path/to/poster.jpg">
    <source src="path/to/your/video.mp4" type="video/mp4">
</lazy-video-loader>
```

## License
This project is licensed under the Apache 2.0 license

## Author
Ben Lim
