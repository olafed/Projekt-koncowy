document.addEventListener("DOMContentLoaded", function(){

//zapisuję element canvas do zmiennej
	const testCanvas = document.getElementById('testCanvas');

//ustawiam szerokość i wysokość dla elementu canvas i powierzchni rysowania
	testCanvas.width = testCanvas.scrollWidth;
	testCanvas.height = testCanvas.scrollWidth;

//ustawiam kontekst rysowania
	const ctx = testCanvas.getContext('2d');

	const addBtn = document.getElementById('addBtn');
	const generateBtn = document.getElementById('generateBtn');

	function addFormElement(index){

		let form = document.querySelector('form');
		let newDiv = document.createElement("div");
		newDiv.classList.add("form-inline");

		let newInputValueLabel = document.createElement("label");
		newInputValueLabel.classList.add("mr-sm-2");
		newInputValueLabel.classList.add("mb-2");
		newInputValueLabel.setAttribute("for", "value-"+index);
		newInputValueLabel.innerText = "Wartość:";

		let newInputValue = document.createElement("input");
		newInputValue.classList.add("mr-sm-2");
		newInputValue.classList.add("mb-2");
		newInputValue.classList.add("form-control");
		newInputValue.setAttribute("type", "tel");
		newInputValue.setAttribute("maxlength", "3");
		newInputValue.setAttribute("min", "0");
		newInputValue.setAttribute("max", "100");
		newInputValue.setAttribute("size", "3");
		newInputValue.setAttribute("id", "value-"+index);
		newInputValue.setAttribute("name", "value-"+index);

		let newInputDescriptionLabel = document.createElement("label");
		newInputDescriptionLabel.classList.add("mr-sm-2");
		newInputDescriptionLabel.classList.add("mb-2");
		newInputDescriptionLabel.setAttribute("for", "description-"+index);
		newInputDescriptionLabel.innerText = "Opis:";

		let newInputDescription = document.createElement("input");
		newInputDescription.classList.add("mr-sm-2");
		newInputDescription.classList.add("mb-2");
		newInputDescription.classList.add("form-control");
		newInputDescription.setAttribute("type", "text");
		newInputDescription.setAttribute("id", "description-"+index);
		newInputDescription.setAttribute("name", "description-"+index);

		let newInputColorLabel = document.createElement("label");
		newInputColorLabel.classList.add("mr-sm-2");
		newInputColorLabel.classList.add("mb-2");
		newInputColorLabel.setAttribute("for", "color-"+index);
		newInputColorLabel.innerText = "Kolor:";

		let newInputColor = document.createElement("input");
		newInputColor.classList.add("mr-sm-2");
		newInputColor.classList.add("mb-2");
		newInputColor.setAttribute("type", "color");
		newInputColor.setAttribute("id", "color-"+index);
		newInputColor.setAttribute("name", "color-"+index);

		form.insertBefore(newDiv, addBtn);
		newDiv.appendChild(newInputValueLabel);
		newDiv.appendChild(newInputValue);
		newDiv.appendChild(newInputDescriptionLabel);
		newDiv.appendChild(newInputDescription);
		newDiv.appendChild(newInputColorLabel);
		newDiv.appendChild(newInputColor);
	}

	class formChangeControl {
		constructor(){
			this.index = 1;
			this.tableOfIndex = [this.index];
			this.tableOfData = [];
		}
		addElement = () => {
			this.index++;
			this.tableOfIndex.push(this.index);
			console.log(this.index,this.tableOfIndex);
			addFormElement(this.index);
		}
		createDataFromForm = () => {
			this.tableOfData = [];
			let a = 0;
			let b = 0;
			const posX = testCanvas.width/2;
			const posY = testCanvas.height/2;
			const radiusLength = testCanvas.width/4;

			for (let i = 1; i <= this.tableOfIndex.length; i++){
				let dataValue = document.getElementById('value-'+i).value;
				console.log(dataValue);
				let dataDescription = document.getElementById('description-'+i).value;
				let dataColor = document.getElementById('color-'+i).value;

				b += Math.PI * 2 * (dataValue/100);
				this.tableOfData.push({value: dataValue, description: dataDescription, color: dataColor, x: posX, y: posY, radius: radiusLength, start: a, stop: b, speed: (b-a)/100});
				a = b;
			}
			console.log(this.tableOfData[0].start);
			return this.tableOfData;
		}
	}




//przykładowe wartości do testów, docelowo będą pobrane z inputów
    // var data = [50, 50];
	// const data = [10, 10, 20, 30, 20, 10];
	// var data = [30, 30, 30, 10];
	// var data = [20, 20, 20, 20, 20];



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
		let textX = Math.cos(element.start + (element.stop - element.start)/2) * (element.radius * 1.4) + testCanvas.width/2;
		let textY = Math.sin(element.start + (element.stop - element.start)/2) * (element.radius * 1.4) + testCanvas.height/2;
		let fontSize = (testCanvas.width/2) / 10;
		let text = element.value + "%";

		ctx.strokeStyle = "lightgrey";
		ctx.beginPath();
		ctx.moveTo(moveX, moveY);
		ctx.lineTo(lineToX, lineToY);
		ctx.stroke();

// do poprawienia pozycjonowanie tekstu na wykresie
		ctx.font = fontSize + "px Calibri";
		ctx.fillStyle = element.color;
		if (textY < testCanvas.height * 0.3){
			ctx.textBaseline="alphabetic";
		} else if (textY > testCanvas.height * 0.7){
			ctx.textBaseline="hanging";
		} else {
			ctx.textBaseline="middle";
		}
		ctx.textAlign = "center";
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

			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(testCanvas.width/2, testCanvas.height/2, testCanvas.width/4 * 0.75, 0, Math.PI * 2);
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
	//

	const formChange = new formChangeControl();

	addBtn.addEventListener('click', (e) => {
		e.preventDefault();
		formChange.addElement();
	});

	generateBtn.addEventListener('click', (e) => {
		e.preventDefault();
		formChange.createDataFromForm();
		console.log(formChange.tableOfData);
		let animation = new AnimatedDonutChart(formChange.tableOfData);
		animation.animateDonutChart();
	});

});
