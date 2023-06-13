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

const ELEMENT_NODE = 1;

const getRect = (node: HTMLElement) => {
	let offsetParent = node.offsetParent as HTMLElement;
	const height = node.offsetHeight;
	const width = node.offsetWidth;
	let left = node.offsetLeft;
	let top = node.offsetTop;

	while (offsetParent && offsetParent.nodeType === ELEMENT_NODE) {
		left += offsetParent.offsetLeft - offsetParent.scrollLeft;
		top += offsetParent.offsetTop - offsetParent.scrollTop;
		offsetParent = offsetParent.offsetParent as HTMLElement;
	}

	return {
		height,
		left,
		top,
		width,
	};
};

const measureLayout = (node: HTMLElement) => {
	const relativeNode = node && node.parentElement;

	if (node && relativeNode) {
		const relativeRect = getRect(relativeNode);
		const { height, left, top, width } = getRect(node);
		const x = left - relativeRect.left;
		const y = top - relativeRect.top;

		return {
			x,
			y,
			width,
			height,
			left,
			top,
		};
	}

	return { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 };
};

export default measureLayout;

export const getBoundingClientRect = (node: HTMLElement) => {
	if (node && node.getBoundingClientRect) {
		const rect = node.getBoundingClientRect();

		return {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
			left: rect.left,
			top: rect.top,
		};
	}

	return { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 };
};
