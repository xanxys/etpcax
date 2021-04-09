"use strict";

class ETPCA {
}

function draw(ca, ctx) {
	const cellHeight = Math.sqrt(3) / 2;

	ctx.save();
	ctx.scale(20, 20);
	for (let y = -50; y < 50; y++) {
		for (let x = -50; x < 50; x++) {
			for (const d of [false, true]) {
				ctx.save();
				ctx.translate(x + 0.5 * y, y * cellHeight);

				ctx.strokeStyle = 'black';
				ctx.lineWidth = 0.05;

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
