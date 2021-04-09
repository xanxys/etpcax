"use strict";

class Pos {
	constructor(x, y, d) {
		this.x = x;
		this.y = y;
		this.d = d;
	}

	toKey() {
		return `${this.x}:${this.y}:${this.d}`;
	}
}

class ETPCA {
	constructor(ruleString) {
		this.state = new Map();
	}

	clear() {
		this.state = new Map();
	}

	setCell(pos, cellState) {
		this.state.set(pos.toKey(), cellState);
	}

	getCell(pos) {
		const st= this.state.get(pos.toKey());
		return st === undefined ? 0 : st;
	}
}

function draw(ca, ctx) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 600, 600); // TODO: get sizes

	const cellHeight = Math.sqrt(3) / 2;

	ctx.save();
	ctx.scale(100, 100);
	for (let y = -50; y < 50; y++) {
		for (let x = -50; x < 50; x++) {
			for (const d of [false, true]) {
				ctx.save();
				ctx.translate(x + 0.5 * y, y * cellHeight);

				// draw cell
				ctx.strokeStyle = '#444';
				ctx.lineWidth = 0.025;
				ctx.beginPath();
				if (d) {
					ctx.moveTo(1, 0);
					ctx.lineTo(0.5, cellHeight);
					ctx.lineTo(1.5, cellHeight);
				} else {
					ctx.moveTo(0, 0);
					ctx.lineTo(0.5, cellHeight);
					ctx.lineTo(1, 0);
				}
				ctx.closePath();
				ctx.stroke();

				// draw cell content
				const cellState = ca.state.get(new Pos(x, y, d).toKey());
				
				if (cellState !== undefined) {
					ctx.fillStyle = '#444';
					if (d) {
						if ((cellState & 1) !== 0) {
							ctx.beginPath();
							ctx.arc(0.5 + 0.375, 0.505, 0.08, 0, 2*Math.PI); // sqrt(3)/2 - (0.5/sqrt(3) + sqrt(3)/4)/2
							ctx.closePath();
							ctx.fill();
						}
						if ((cellState & 2) !== 0) {
							ctx.beginPath();
							ctx.arc(0.5 + 1 - 0.375, 0.505, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
							ctx.fill();
							ctx.closePath();
							ctx.fill();
						}
						if ((cellState & 4) !== 0) {
							ctx.beginPath();
							ctx.arc(0.5 + 0.5, 0.722, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
							ctx.fill();
							ctx.closePath();
							ctx.fill();
						}
					} else {
						if ((cellState & 1) !== 0) {
							ctx.beginPath();
							ctx.arc(0.375, 0.361, 0.08, 0, 2*Math.PI); // (0.5/sqrt(3) + sqrt(3)/4)/2
							ctx.closePath();
							ctx.fill();
						}
						if ((cellState & 2) !== 0) {
							ctx.beginPath();
							ctx.arc(0.5, 0.144, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
							ctx.fill();
							ctx.closePath();
							ctx.fill();
						}
						if ((cellState & 4) !== 0) {
							ctx.beginPath();
							ctx.arc(1 - 0.375, 0.361, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
							ctx.fill();
							ctx.closePath();
							ctx.fill();
						}
					}
				}

				ctx.restore();
			}
		}
	}
	ctx.restore();
}

class ExplorerApp {
	constructor() {
		this.ca = new ETPCA('0000');

		const canvas = document.getElementById('ca_canvas');
		const ctx = canvas.getContext('2d');
		draw(this.ca, ctx);

		const app = this;
        this.vm = new Vue({
            el: '#vue_menu',
            data: {
            },
            methods: {
				onClickReset: function() {
					app.ca.clear();
					draw(app.ca, ctx);
				},
				onClickRandomize: function(n) {
					for (let y = 0; y < n; y++) {
						for (let x = 0; x < n; x++) {
							for (const d of [false, true]) {
								const p = new Pos(x, y, d);
								app.ca.setCell(p, Math.floor(Math.random() * 8));
							}
						}
					}
					draw(app.ca, ctx);
				},
				onClickStep: function() {
					app.ca.step();
					draw(app.ca, ctx);
				},
				onChangeRuleString: function(ev) {
					app.ca = new ETPCA(ev.target.value);
					draw(app.ca, ctx);
				},
            },
            computed: {

            },
        });
	}
}

const explorer = new ExplorerApp();
