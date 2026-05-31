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

## Controls

- Arrow Up: accelerate
- Arrow Down: brake / reverse
- Arrow Left / Arrow Right: steer

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks the source with ESLint.

## Project Shape

- `index.html` is the Vite entry point.
- `src/game.js` contains the main loop.
- `src/physics/stepVehicle.js` updates car movement.
- `src/track/track.js` builds and queries the race track.
- `src/ai/getAIControls.js` drives the CPU car.
