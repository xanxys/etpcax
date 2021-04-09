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
	constructor() {
		this.state = new Map();
		this.state.set(new Pos(0, 0, false).toKey(), 0b111);
		this.state.set(new Pos(0, 0, true).toKey(), 0b111);
	}
}

function draw(ca, ctx) {
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
							ctx.arc(0.5 + 0.5, 0.722, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
							ctx.fill();
							ctx.closePath();
							ctx.fill();
						}
						if ((cellState & 4) !== 0) {
							ctx.beginPath();
							ctx.arc(0.5 + 1 - 0.375, 0.505, 0.08, 0, 2*Math.PI); // 0.5/sqrt(3) /2
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
		const ca = new ETPCA();

		const canvas = document.getElementById('ca_canvas');
		const ctx = canvas.getContext('2d');
		draw(ca, ctx);

        this.vm = new Vue({
            el: '#vue_menu',
            data: {
            },
            methods: {
				onClickReset: function() {
					ca = new ETPCA();
					draw(ca, ctx);
				},
				onClickRandomize: function(n) {
					// TODO: randomize
					draw(ca, ctx);
				},
				onClickStep: function() {
					ca.step();
					draw(ca, ctx);
				},
            },
            computed: {

            },
        });
	}
}

const explorer = new ExplorerApp();
