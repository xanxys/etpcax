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
		console.assert(ETPCA.isValidRule(ruleString));

		const ruleTable = new Array(8); // neighbor st -> state
		ruleTable[0] = parseInt(ruleString[0]);

		const r1 = parseInt(ruleString[1]);
		ruleTable[1] = ETPCA.rotateCW(r1, -1);
		ruleTable[2] = ETPCA.rotateCW(r1, 0);
		ruleTable[4] = ETPCA.rotateCW(r1, 1);

		const r2 = parseInt(ruleString[2]);
		ruleTable[1 + 2] = ETPCA.rotateCW(r2, 1);
		ruleTable[2 + 4] = ETPCA.rotateCW(r2, 2);
		ruleTable[4 + 1] = ETPCA.rotateCW(r2, 0);

		ruleTable[1 + 2 + 4] = parseInt(ruleString[3]);
		this.ruleTable = ruleTable;
		console.log("rule", ruleString, "->", this.ruleTable);

		this.size = 10;
		this.boundary = 0b000;
		this.state = new Map();
	}

	static rotateCW(state, n) {
		// cyclic shift (higher bit = CW)
		n = ((n % 3) + 3) % 3;
		state = state << n;
		return ((state & 0b11000) >> 3) | (state & 0b111);
	}

	static isValidRule(ruleString) {
		if (ruleString.length !== 4) {
			return false;
		}
		const r0 = parseInt(ruleString[0]);
		const r1 = parseInt(ruleString[1]);
		const r2 = parseInt(ruleString[2]);
		const r3 = parseInt(ruleString[3]);
		if (r0 != 0 && r0 != 7) {
			return false;
		}
		if (!(0 <= r1 && r1 <= 7)) {
			return false;
		}
		if (!(0 <= r2 && r2 <= 7)) {
			return false;
		}
		if (r3 != 0 && r3 != 7) {
			return false;
		}
		return true;
	}

	clear() {
		this.state = new Map();
	}

	setCell(pos, cellState) {
		this.state.set(pos.toKey(), cellState);
	}

	getCell(pos) {
		if (pos.x < 0 || pos.y < 0 || pos.x >= this.size || pos.y >= this.size) {
			return this.boundary;
		}
		const st= this.state.get(pos.toKey());
		return st === undefined ? 0b000 : st;
	}

	getNeighborState(pos) {
		let r = 0;
		if (pos.d) {
			r |= (this.getCell(new Pos(pos.x, pos.y, false)) & 4) ? 1 : 0;
			r |= (this.getCell(new Pos(pos.x + 1, pos.y, false)) & 1) ? 2 : 0;
			r |= (this.getCell(new Pos(pos.x, pos.y + 1, false)) & 2) ? 4 : 0;
		} else {
			r |= (this.getCell(new Pos(pos.x - 1, pos.y, true)) & 2) ? 1 : 0;
			r |= (this.getCell(new Pos(pos.x, pos.y - 1, true)) & 4) ? 2 : 0;
			r |= (this.getCell(new Pos(pos.x, pos.y, true)) & 1) ? 4 : 0;
		}
		return r;
	}

	step() {
		const newState = new Map();
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				for (const d of [false, true]) {
					const p = new Pos(x, y, d);
					newState.set(p.toKey(), this.ruleTable[this.getNeighborState(p)]);
				}
			}
		}
		this.state = newState;
	}
}

function draw(ca, ctx) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 600, 600); // TODO: get sizes

	const cellHeight = Math.sqrt(3) / 2;

	ctx.save();
	ctx.scale(50, 50);
	ctx.translate(5, 5);
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
				if (x < 0 || y < 0 || x >= ca.size || y >= ca.size) {
					ctx.fillStyle = '#fee';
					ctx.fill();
				}

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
		this.ca = new ETPCA('0347');

		const canvas = document.getElementById('ca_canvas');
		const ctx = canvas.getContext('2d');
	

		const app = this;
        this.vm = new Vue({
            el: '#vue_menu',
            data: {
				step: 0,
            },
            methods: {
				onClickReset: function() {
					this.step = 0;

					app.ca.clear();
					app.ca.setCell(new Pos(2, 2, false), 0b001);
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
					this.step++;

					app.ca.step();
					draw(app.ca, ctx);
				},
				onChangeRuleString: function(ev) {
					this.step = 0;
					app.ca = new ETPCA(ev.target.value);
					draw(app.ca, ctx);
				},
            },
            computed: {

            },
        });

		this.vm.onClickReset();
	}
}

const explorer = new ExplorerApp();
