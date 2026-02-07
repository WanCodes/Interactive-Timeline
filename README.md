# Interactive Timeline

A horizontal, draggable interactive timeline that presents company history year by year. Users can scroll through decades of events, watch embedded videos, view images and quotes, and jump to specific years via a sidebar.

## What This Project Contains

### Overview

This is a **single-page web application** that displays a chronological timeline (1974–2017 in the default data). Each year is a “frame” with:

- **Assets**: Text blocks, quotes, images, or video thumbnails
- **Articles**: Categorized content (Economic, Technology, People, Geography) with optional lightbox links
- **Navigation**: Sidebar year list, left/right arrows, and drag-to-scroll

Content is **data-driven**: all events, copy, and media references come from `data.json`, so you can adapt the timeline to any story by editing the JSON.

### Features

- **Draggable timeline** – Scroll horizontally by dragging the timeline (powered by [Dragdealer](https://github.com/skidding/dragdealer))
- **Year navigation** – Click a year in the left sidebar to jump to that year; current year is highlighted (red)
- **Arrow controls** – Left/right arrows to move one frame at a time
- **Video playback** – Click video thumbnails to open an overlay and play [Brightcove](https://www.brightcove.com/) videos
- **Lightbox** – Article links can open full-screen image lightboxes (e.g. historical site screenshots)
- **Responsive layout** – Timeline width and number of visible frames adjust to viewport size
- **Animated UI** – [GSAP TweenMax](https://greensock.com/tweenmax/) used for transitions and parallax-style background movement

### Tech Stack

| Layer      | Technology |
|-----------|------------|
| Markup    | HTML5      |
| Styling   | CSS3 (custom, Avenir Next fonts) |
| Logic     | JavaScript (jQuery 3.x, custom `Timeline` class) |
| Animation | GSAP TweenMax 1.18 |
| Slider    | Dragdealer.js (custom/bundled) |
| Video     | Brightcove Video.js (loaded from CDN) |

### Project Structure

```
Interactive-Timeline/
├── index.html          # Main page and layout
├── main.css            # Styles (layout, timeline, nav, video, lightbox)
├── main.js             # Timeline logic: load data, build DOM, drag/nav/video/lightbox
├── data.json           # Timeline content (years, assets, articles)
├── dragdealer.js       # Horizontal drag/slider library
├── bg.jpg              # Repeating background for timeline strip
├── close_btn.png       # Close button for video/lightbox
├── play_icon.png       # Overlay on video thumbnails
├── quote_icon.png      # Quote styling asset
├── red_arrow.png       # Divider/indicator arrow
├── topics.png          # Sidebar “topics” graphic
├── images/             # Year-specific images (thumbnails, assets)
└── history/            # Images used in lightbox (e.g. historical screenshots)
```

### Data Format (`data.json`)

The timeline is driven by a single JSON object:

```json
{
  "events": [
    {
      "year": "1974",
      "employees": "3 employees",
      "asset": [
        {
          "type": "video",
          "url": "images/1974.jpg",
          "video_id": "5449365950001",
          "message": "Caption text"
        }
      ],
      "articles": [
        {
          "title": "ECONOMIC",
          "text": "Article body HTML...",
          "lightbox": { "url": "history/1998.jpg", "text": "Link text" }
        }
      ]
    }
  ]
}
```

- **`asset`** types: `"text"` (message), `"quote"` (message), `"video"` (url, video_id, message), `"image"` (url).
- **`articles`**: Each has `title` and `text`; optional `lightbox` adds a clickable link that opens the image in the lightbox.

Videos are played via Brightcove; `video_id` (and the Brightcove account/player in `index.html`) must match your Brightcove setup if you use your own account.

### How to Run

1. **Local server (recommended)** – Many features (e.g. loading `data.json`) work best over HTTP:
   ```bash
   # Python 3
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```
   Or use any static server (e.g. Node `serve`, VS Code “Live Server”) pointed at the project folder.

2. **Open `index.html` directly** – May work in some browsers for basic viewing, but JSON loading can be blocked by CORS/file protocol restrictions.

### Browser Support

- Built for modern browsers (ES5-style JS, jQuery, GSAP).
- `index.html` includes `X-UA-Compatible` for IE=10,Edge; full support depends on Dragdealer, GSAP, and Brightcove compatibility with older browsers.

### Customization

- **Content**: Edit `data.json` to change years, copy, assets, and lightbox links.
- **Videos**: Replace Brightcove account/player IDs in `index.html` and use your own `video_id` values in `data.json`.
- **Look and feel**: Adjust `main.css` (colors, fonts, sizes) and swap images in `images/` and `history/` as needed.

### License

No license file is included in the repo; assume all rights reserved unless stated otherwise.
