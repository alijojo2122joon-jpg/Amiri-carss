# Amiri Cars

A free, browser-based 3D driving prototype built with Three.js. No account, subscription, or build step required.

## Features
- Real-time 3D rendering, ACES tone mapping, shadows, fog, metallic sports car
- Endless highway with hills, trees, clouds, traffic and scrolling road markings
- Acceleration, braking, steering, speedometer, distance counter and saved best speed
- Three camera modes
- Keyboard controls and touch controls for mobile
- Responsive HUD and no paid assets

## Run locally
Because the game uses JavaScript modules, serve the folder over HTTP (do not open `index.html` directly).

**Python**
```bash
python -m http.server 8000
```
Open `http://localhost:8000`.

## Controls
- `W` / `↑`: accelerate
- `S` / `↓`: brake
- `A` / `←`: steer left
- `D` / `→`: steer right
- `C`: change camera
- `Enter`: start

## Requirements
A modern browser with WebGL. Internet is required to load Three.js from jsDelivr and Google Fonts. Gameplay logic runs locally in the browser.

## Notes
This is an ambitious visual prototype, not a AAA simulator. The vehicle is procedurally modeled and the driving is arcade-style; realistic licensed car assets, physically accurate vehicle simulation, and high-end environment assets would be separate upgrades.

## License
MIT
