import createGame from './game.js';
import { VIEW_WIDTH, VIEW_HEIGHT } from './View.js';

var template = document.createElement('template');
template.innerHTML = `
	<style>
		:host {
			display: block;
			outline: none;
			background: #ffffff;
		}

		.stage {
			position: relative;
		}

		canvas {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: ${VIEW_WIDTH} / ${VIEW_HEIGHT};
		}

		button {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			border: 1px solid #bbbbbb;
			background: #ffffff;
			color: #555555;
			cursor: pointer;
		}

		button:hover {
			border-color: #777777;
			color: #222222;
		}

		button:focus-visible {
			outline: 1px solid #777777;
			outline-offset: 2px;
		}

		/* Play: shown until the game has keyboard focus */
		.play {
			left: 50%;
			top: 50%;
			width: 72px;
			height: 72px;
			border-radius: 50%;
			transform: translate(-50%, -50%);
		}

		:host(:focus) .play,
		:host(:focus-within) .play {
			display: none;
		}

		/* Full screen: top-right corner, icon flips while in full screen */
		.fullscreen {
			top: 12px;
			right: 12px;
			width: 32px;
			height: 32px;
			border-radius: 4px;
		}

		.fullscreen[hidden] {
			display: none;
		}

		.fullscreen .exit,
		:host(:fullscreen) .fullscreen .enter {
			display: none;
		}

		:host(:fullscreen) .fullscreen .exit {
			display: block;
		}

		/* In full screen, show the track as large as fits the screen */
		:host(:fullscreen) {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		:host(:fullscreen) .stage {
			width: min(100vw, calc(100vh * ${VIEW_WIDTH} / ${VIEW_HEIGHT}));
		}
	</style>
	<div class="stage">
		<canvas width="${VIEW_WIDTH}" height="${VIEW_HEIGHT}" part="canvas"></canvas>
		<button class="play" type="button" aria-label="Play">
			<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
				<path d="M10 7 L21 14 L10 21 Z" fill="currentColor"/>
			</svg>
		</button>
		<button class="fullscreen" type="button" aria-label="Full screen">
			<svg class="enter" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M1.5 6 V1.5 H6 M10 1.5 H14.5 V6 M14.5 10 V14.5 H10 M6 14.5 H1.5 V10" fill="none" stroke="currentColor"/>
			</svg>
			<svg class="exit" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M6 1.5 V6 H1.5 M14.5 6 H10 V1.5 M10 14.5 V10 H14.5 M1.5 10 H6 V14.5" fill="none" stroke="currentColor"/>
			</svg>
		</button>
	</div>
`;

// <car-race></car-race>: press play, then drive with the arrow keys
class CarRace extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
		this.game = null;
		this.visibilityObserver = null;
		this.resizeObserver = null;
	}

	connectedCallback() {
		var canvas = this.shadowRoot.querySelector('canvas');
		var playButton = this.shadowRoot.querySelector('.play');
		var fullscreenButton = this.shadowRoot.querySelector('.fullscreen');

		if (!this.hasAttribute('tabindex')) {
			this.setAttribute('tabindex', '0');
		}
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', 'application');
			this.setAttribute('aria-label', 'Racing game: press play, then drive with the arrow keys');
		}

		this.game = createGame(canvas, this);

		// Focus the element itself (not the button) so the arrow keys reach the game
		playButton.onclick = function() {
			this.focus();
		}.bind(this);

		// Some browsers (e.g. Safari on iPhone) can't put an element in full screen
		fullscreenButton.hidden = !document.fullscreenEnabled;
		fullscreenButton.onclick = function() {
			if (document.fullscreenElement === this) {
				document.exitFullscreen();
			} else {
				this.requestFullscreen();
			}
			this.focus();
		}.bind(this);

		// Give the canvas one pixel per screen pixel at whatever width it's shown, so it stays sharp
		this.resizeObserver = new ResizeObserver(function() {
			var pixelWidth = Math.round(canvas.clientWidth * (window.devicePixelRatio || 1));

			if (pixelWidth > 0 && pixelWidth !== canvas.width) {
				canvas.width = pixelWidth;
				canvas.height = Math.round(pixelWidth * VIEW_HEIGHT / VIEW_WIDTH);
			}
		});
		this.resizeObserver.observe(canvas);

		// Only run while on screen, so it costs nothing when scrolled past on a page
		this.visibilityObserver = new IntersectionObserver(function(entries) {
			if (entries[entries.length - 1].isIntersecting) {
				this.game.start();
			} else {
				this.game.stop();
			}
		}.bind(this));
		this.visibilityObserver.observe(this);
	}

	disconnectedCallback() {
		this.visibilityObserver.disconnect();
		this.visibilityObserver = null;
		this.resizeObserver.disconnect();
		this.resizeObserver = null;
		this.game.destroy();
		this.game = null;
	}
}

if (!customElements.get('car-race')) {
	customElements.define('car-race', CarRace);
}

export default CarRace;
