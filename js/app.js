document.addEventListener("DOMContentLoaded", function(){

	const testCanvas = document.getElementById('testCanvas');

	console.log(testCanvas);


	testCanvas.width = testCanvas.scrollWidth;
	testCanvas.height = testCanvas.scrollHeight;

	const ctx = testCanvas.getContext('2d');


    // var data = [50, 50];
	const data = [10, 10, 20, 30, 20, 10];
	// var data = [30, 30, 30, 10];
	// var data = [20, 20, 20, 20, 20];

	function createJson(array, posX, posY, radiusLength) {
		let dataArray = [];
		let a = 0;
		let b = 0;
		array.forEach(function(element) {

			let red = Math.floor(Math.random() * 255);
			let green = Math.floor(Math.random() * 255);
			let blue = Math.floor(Math.random() * 255);
			let fillColor = "rgb(" + red + "," + green + "," + blue + ")";

			b += Math.PI * 2 * (element/100);
			dataArray.push({value: element, x: posX, y: posY, radius: radiusLength, start: a, stop: b, color: fillColor, speed: (b-a)/100});
			a = b;
		});
		return dataArray;
	}

	const jsonArr = createJson(data, 400, 300, 200);


    // console.log(jsonArr);

	class AnimatedPieChart {
		constructor(arr){
			// this.boundUpdate = this.update.bind(this);
			this.pieces = arr;
			console.log(this.pieces)
		}
		animatePieChart = () => {
			ctx.clearRect(0, 0, testCanvas.width, testCanvas.height);

			// console.log(this)
			this.pieces.forEach((element) => {
				ctx.fillStyle = element.color;
				ctx.beginPath();
				ctx.arc(element.x, element.y, element.radius, element.start, element.start + element.speed);
				ctx.lineTo(element.x, element.y);
				ctx.fill();
				element.speed += (element.stop-element.start)/100;
			});

			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(400, 300, 160, 0, Math.PI * 2);
			ctx.fill();

			if (Math.round((this.pieces[0].start + this.pieces[0].speed)*1000) / 1000 <= Math.round(this.pieces[0].stop * 1000) / 1000) {
				// console.log(this.pieces[0].start + this.pieces[0].speed, this.pieces[0].stop);
				window.requestAnimationFrame(this.animatePieChart);
				// console.log(this);
			} else {
				// console.log(this.pieces[0].speed);
				window.cancelAnimationFrame(this.animatePieChart);
							// console.log(this.pieces);
	            this.pieces.forEach((element) => {
	                ctx.font = "20px Georgia";
	                ctx.fillStyle = element.color;
	                let text = element.value + "%";
	                let moveX = Math.cos(element.start + (element.stop - element.start)/2) * element.radius + 400;
	                let moveY = Math.sin(element.start + (element.stop - element.start)/2) * element.radius + 300;
	                let lineToX = Math.cos(element.start + (element.stop - element.start)/2) * (element.radius * 1.2) + 400;
	                let lineToY = Math.sin(element.start + (element.stop - element.start)/2) * (element.radius * 1.2) + 300;
	                let textX = Math.cos(element.start + (element.stop - element.start)/2) * (element.radius * 1.3) + 400;
	                let textY = Math.sin(element.start + (element.stop - element.start)/2) * (element.radius * 1.3) + 300;
	                ctx.strokeStyle = "lightgrey";
									ctx.shadowBlur=0;
									ctx.shadowColor="black";
	                ctx.beginPath();
	                ctx.moveTo(moveX, moveY);
	                ctx.textAlign = "center";
	                ctx.textBaseline="middle";
	                ctx.fillText(text, textX, textY);
	                ctx.lineTo(lineToX, lineToY);
	                ctx.stroke();
	            })
			}
		}
	};

	let animation = new AnimatedPieChart(jsonArr);

	animation.animatePieChart();
});
