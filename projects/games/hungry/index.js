window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	ctx.font = "20px _sans";
	ctx.textBaseline = "top";
	ctx.fillText("Hello World", 195, 80);
}

function drawScreen(ctx) {
	ctx.filleStyle = "hsl(0, 0%, 90%)";
	ctx.fillRect(0, 0, 600, 500);
}
