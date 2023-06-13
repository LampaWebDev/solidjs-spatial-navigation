/*
MIT License

Copyright (c) 2022 NoriginMedia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// We'll make VisualDebugger no-op for any environments lacking a DOM (e.g. SSR and React Native non-web platforms).
const hasDOM = typeof window !== 'undefined' && window.document;

const WIDTH = hasDOM ? window.innerWidth : 0;
const HEIGHT = hasDOM ? window.innerHeight : 0;

interface NodeLayout {
	left: number;
	top: number;
	width: number;
	height: number;
}

class VisualDebugger {
	private debugCtx: CanvasRenderingContext2D;

	private layoutsCtx: CanvasRenderingContext2D;

	constructor() {
		if (hasDOM) {
			this.debugCtx = VisualDebugger.createCanvas('sn-debug', '1010');
			this.layoutsCtx = VisualDebugger.createCanvas('sn-layouts', '1000');
		}
	}

	static createCanvas(id: string, zIndex: string) {
		const canvas: HTMLCanvasElement =
			document.querySelector(`#${id}`) || document.createElement('canvas');

		canvas.setAttribute('id', id);

		const ctx = canvas.getContext('2d');

		canvas.style.zIndex = zIndex;
		canvas.style.position = 'fixed';
		canvas.style.top = '0';
		canvas.style.left = '0';

		document.body.appendChild(canvas);

		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		return ctx;
	}

	clear() {
		if (!hasDOM) {
			return;
		}

		this.debugCtx.clearRect(0, 0, WIDTH, HEIGHT);
	}

	clearLayouts() {
		if (!hasDOM) {
			return;
		}

		this.layoutsCtx.clearRect(0, 0, WIDTH, HEIGHT);
	}

	drawLayout(layout: NodeLayout, focusKey: string, parentFocusKey: string) {
		if (!hasDOM) {
			return;
		}
		this.layoutsCtx.strokeStyle = 'green';
		this.layoutsCtx.strokeRect(layout.left, layout.top, layout.width, layout.height);
		this.layoutsCtx.font = '8px monospace';
		this.layoutsCtx.fillStyle = 'red';
		this.layoutsCtx.fillText(focusKey, layout.left, layout.top + 10);
		this.layoutsCtx.fillText(parentFocusKey, layout.left, layout.top + 25);
		this.layoutsCtx.fillText(`left: ${layout.left}`, layout.left, layout.top + 40);
		this.layoutsCtx.fillText(`top: ${layout.top}`, layout.left, layout.top + 55);
	}

	drawPoint(x: number, y: number, color = 'blue', size = 10) {
		if (!hasDOM) {
			return;
		}
		this.debugCtx.strokeStyle = color;
		this.debugCtx.lineWidth = 3;
		this.debugCtx.strokeRect(x - size / 2, y - size / 2, size, size);
	}
}

export default VisualDebugger;
