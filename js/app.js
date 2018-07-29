document.addEventListener("DOMContentLoaded", function(){

//zapisuję element canvas do zmiennej
	const testCanvas = document.getElementById('testCanvas');

//ustawiam szerokość i wysokość dla elementu canvas i powierzchni rysowania
	testCanvas.width = testCanvas.scrollWidth;
	testCanvas.height = testCanvas.scrollWidth;

//ustawiam kontekst rysowania
	const ctx = testCanvas.getContext('2d');

//przykładowe wartości do testów, docelowo będą pobrane z inputów
    // var data = [50, 50];
	const data = [10, 10, 20, 30, 20, 10];
	// var data = [30, 30, 30, 10];
	// var data = [20, 20, 20, 20, 20];


//funkcja generująca obiekty z danych pobieranych z inputów, docelowo ma przyjmować tablicę, labelki oraz kolory jeżeli użytkownik tak zadecyduje

	function createJson(array) {
		let dataArray = [];
		let a = 0;
		let b = 0;
		const posX = testCanvas.width/2;
		const posY = testCanvas.height/2;
		const radiusLength = testCanvas.width/4;

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

//wywołanie funkcji, która tworzy tablicę - podpiąć ją pod przycisk wyślij dane
	const jsonArr = createJson(data);

//funkcje wspólna dla wykresu kołowego i wykresu "pączek"

	function drawPiece(element){
		ctx.fillStyle = element.color;
		ctx.beginPath();
		ctx.arc(element.x, element.y, element.radius, element.start, element.start + element.speed);
		ctx.lineTo(element.x, element.y);
		ctx.fill();
		element.speed += (element.stop-element.start)/100;
	}

	function addTextToPiece(element){
		let moveX = Math.cos(element.start + (element.stop - element.start)/2) * element.radius + testCanvas.width/2;
		let moveY = Math.sin(element.start + (element.stop - element.start)/2) * element.radius + testCanvas.height/2;
		let lineToX = Math.cos(element.start + (element.stop - element.start)/2) * (element.radius * 1.2) + testCanvas.width/2;
		let lineToY = Math.sin(element.start + (element.stop - element.start)/2) * (element.radius * 1.2) + testCanvas.height/2;
		let textX = Math.cos(element.start + (element.stop - element.start)/2) * (element.radius * 1.3) + testCanvas.width/2;
		let textY = Math.sin(element.start + (element.stop - element.start)/2) * (element.radius * 1.3) + testCanvas.height/2;
		let fontSize = (testCanvas.width/2) / 10;
		let text = element.value + "%";
		ctx.font = fontSize + "px Calibri";
		ctx.fillStyle = element.color;
		ctx.strokeStyle = "lightgrey";
		ctx.beginPath();
		ctx.moveTo(moveX, moveY);
		ctx.lineTo(lineToX, lineToY);
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.textBaseline="middle";
		ctx.fillText(text, textX, textY);
	}


// obiekt animowany wykres kołowy
	class AnimatedPieChart {
		constructor(arr){
			this.pieces = arr;
		}
		animatePieChart = () => {
			ctx.clearRect(0, 0, testCanvas.width, testCanvas.height);

			this.pieces.forEach(drawPiece);

			if (Math.round((this.pieces[0].start + this.pieces[0].speed)*1000) / 1000 <= Math.round(this.pieces[0].stop * 1000) / 1000) {
				window.requestAnimationFrame(this.animatePieChart);
			} else {
				window.cancelAnimationFrame(this.animatePieChart);
				this.pieces.forEach(addTextToPiece);
			}
		}
	};

// obiekt animowany wykres "pączek"
	class AnimatedDonutChart {
		constructor(arr){
			this.pieces = arr;
		}
		animateDonutChart = () => {
			ctx.clearRect(0, 0, testCanvas.width, testCanvas.height);

			this.pieces.forEach(drawPiece);

// do wykresu "pączek"
			ctx.fillStyle = "white";
			ctx.beginPath();
			let whiteRadius = testCanvas.width/4 * 0.75;
			console.log(whiteRadius);
			ctx.arc(testCanvas.width/2, testCanvas.height/2, whiteRadius, 0, Math.PI * 2);
			ctx.fill();

			if (Math.round((this.pieces[0].start + this.pieces[0].speed)*1000) / 1000 <= Math.round(this.pieces[0].stop * 1000) /1000) {
				window.requestAnimationFrame(this.animateDonutChart);
			} else {
				window.cancelAnimationFrame(this.animateDonutChart);
				this.pieces.forEach(addTextToPiece);
			}
		}
	};

	// let animation = new AnimatedPieChart(jsonArr);
	//
	// animation.animatePieChart();

	let animation = new AnimatedDonutChart(jsonArr);

	animation.animateDonutChart();
});
