import createGame from './game.js';

var template = document.createElement('template');
template.innerHTML = `
	<style>
		:host {
			display: block;
			outline: none;
			cursor: pointer;
		}

		:host(:focus) {
			cursor: default;
		}

		canvas {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 3 / 2;
		}
	</style>
	<canvas width="1200" height="800" part="canvas"></canvas>
`;

// <car-race></car-race>: click it, then drive with the arrow keys
class CarRace extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
		this.game = null;
		this.visibilityObserver = null;
		this.resizeObserver = null;
	}

	connectedCallback() {
		if (!this.hasAttribute('tabindex')) {
			this.setAttribute('tabindex', '0');
		}
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', 'application');
			this.setAttribute('aria-label', 'Racing game: click, then drive with the arrow keys');
		}

		var canvas = this.shadowRoot.querySelector('canvas');

		this.game = createGame(canvas, this);

		// Give the canvas one pixel per screen pixel at whatever width it's shown, so it stays sharp
		this.resizeObserver = new ResizeObserver(function() {
			var pixelWidth = Math.round(canvas.clientWidth * (window.devicePixelRatio || 1));

			if (pixelWidth > 0 && pixelWidth !== canvas.width) {
				canvas.width = pixelWidth;
				canvas.height = Math.round(pixelWidth * 2 / 3);
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
