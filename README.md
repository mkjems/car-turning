# Car Turning

A tiny browser racing experiment about making a top-down car turn in a natural-feeling way. The player drives one car around a generated track while a simple CPU driver follows the same course.

## Run It

Install dependencies:

```sh
npm install
```

Start the Vite dev server:

```sh
npm run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173/`.

## Use It On Another Page

The game is a web component, `<car-race>`. GitHub Pages publishes it on every push to `master`:

```html
<script type="module" src="https://mkjems.github.io/car-turning/car-race.js"></script>

<section>
  <car-race></car-race>
</section>
```

It fills the full width of its container and keeps a wide 5:2 shape, with the track centred. Click it to give it focus, then drive. Arrow keys only steer while it has focus, so the rest of the page scrolls normally. It pauses while scrolled out of view.

## Controls

- Arrow Up: accelerate
- Arrow Down: brake / reverse
- Arrow Left / Arrow Right: steer

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` builds the component into a single file, `dist/car-race.js`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks the source with ESLint.

## Project Shape

- `index.html` is the local dev page.
- `src/car-race.js` defines the `<car-race>` element.
- `src/game.js` contains the main loop for one game.
- `src/physics/stepVehicle.js` updates car movement.
- `src/track/track.js` builds and queries the race track.
- `src/physics/collideCars.js` handles car-to-car collisions.
- `src/ai/getAIControls.js` drives the CPU car.
- `pages/index.html` is the demo page published next to the component.
- `.github/workflows/pages.yml` builds and publishes to GitHub Pages.
