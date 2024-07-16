// let addEvent = require('./calendar')
// Element list
let testDate = document.getElementsByName('testDate')[0]
// let calcType = document.querySelector('#calcType')
let calcTypeLabels = document.querySelectorAll('[name="calcType"]')
let numOfTopics = document.querySelector('input[type="number"]')
let inputStyleRange = document.querySelectorAll('input[type="range"]')
let topicTable = document.getElementById('topic-table')

let currentRows = 1
let lastStyle = "diff"
let currentType = "diff"
let testDateValue = ""
let today = new Date()

let sliderDiffIconUrls = [
	"https://img.icons8.com/?size=100&id=-M67kodTvLgh&format=png&color=000000",
	"https://img.icons8.com/?size=100&id=16038&format=png&color=000000",
	"https://img.icons8.com/?size=100&id=16087&format=png&color=000000",
	"https://img.icons8.com/?size=100&id=22063&format=png&color=000000",
	"https://img.icons8.com/?size=100&id=16102&format=png&color=000000"

]


// TRIGGERS =-=-=-=-=-=-=-=-=-=-= \\
window.onload = () => {
	inputStyleRange[0].style.setProperty('--sliderImage', `url("${sliderDiffIconUrls[inputStyleRange[0].value - 1]}")`)
	inputStyleRange[0].style.setProperty('--thumbContent', inputStyleRange[0].value)
	loadSave("currentSession-thisisauniquestring123");
}

document.body.addEventListener("change", (event) => {
	if (
		event.target !== testDate &&
		event.target.type !== "number" &&
		event.target.type !== "date" &&
		event.target.type !== "text" &&
		event.target.type !== "range"
	) {
		return;
	}
	sessionSave();
});

testDate.addEventListener('change', () => {
	testDateValue = new Date(testDate.value)
})

calcTypeLabels.forEach((check) => {
	check.addEventListener('change', (ev) => {
	//   console.log("clicked radio button")
		let input = ev.target
		if (input.checked == true) {
			setCalcType(input.value)
			currentType = input.value
			setRangeStyle()
		}
	})
  })

const setRangeStyle = () => {
	inputStyleRange = document.querySelectorAll('input[type="range"]')
	inputStyleRange.forEach((slider) => {
		setSlider(slider)
	})
}

setRangeStyle()

numOfTopics.addEventListener("change", () => {
	updateRows(numOfTopics.value);
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-= \\


// FUNCTIONS =-=-=-=-=-=-=-=-=-=-= \\

function setSlider(slider) {

	slider.classList.remove(currentType == "diff" ? "days" : "diff")
	slider.classList.add(currentType)

	console.log(currentType)

	if (currentType == "diff") {
		slider.setAttribute('max', '5')
		slider.value = 1

		if (slider.style.getPropertyValue('--sliderImage') == (null || "")) {
			slider.style.setProperty('--sliderImage', `url("${sliderDiffIconUrls[slider.value - 1]}")`)
		}

		slider.addEventListener('input', () => {
			slider.style.setProperty('--sliderImage', `url("${sliderDiffIconUrls[slider.value - 1]}")`)
		})
	} else {
		let date
		let max


		max = 100 // NOT SETTING MAX PROPERLY
		// if (!testDateValue)
		// 	date = today
		// else date = testDateValue

		// if (date == today) max = 100
		// else {
		// 	let distance = date - today
		// 	max = distance / (1000 * 60 * 60 * 24)
		// }
		slider.setAttribute('max', max)
		slider.setAttribute('step', 5)
		slider.value = 1

		slider.style.setProperty('--thumbContent', '100')
	}
}

const updateRows = (newRowCount) => {
	if (newRowCount > currentRows) {
		for (let i = 0; i < newRowCount - currentRows; i++) {
			addRow();
		}
	} else {
		for (let i = 0; i < currentRows - newRowCount; i++) {
			deleteRow();
		}
	}
	currentRows = newRowCount;
}

function addRow() {
	const rowCount = topicTable.rows.length
	const newRow = topicTable.insertRow(rowCount)

	// let newTopicInput = document.createElement('td')
	let topicInput = document.createElement('input')
	// topicInput.setAttribute('name', `table-r${rowCount + 1}-topic`)
	topicInput.setAttribute('type', 'text')
	topicInput.setAttribute('placeholder', `${rowCount}`)
	topicInput.classList.add('topic-row-text')
	// newTopicInput.append(topicInput)

	// let newDateInput = document.createElement('td')
	let dateInput = document.createElement('input')
	// dateInput.setAttribute('name', `table-r${rowCount + 1}-date`)
	dateInput.setAttribute('type', 'date')
	dateInput.classList.add('topic-row-date')
	// newDateInput.append(dateInput)

	// let newStyleInput = document.createElement('td')
	let styleInput = document.createElement('input')
	// styleInput.setAttribute('name', `table-r${rowCount + 1}-date`)
	styleInput.setAttribute('type', 'range')
	if (currentType == 'diff') {
		styleInput.setAttribute('min', '1')
		styleInput.setAttribute('max', '5')
		styleInput.setAttribute('value', '1')
		styleInput.classList.add('diff')
	} else {
		styleInput.setAttribute('min', '5')
		styleInput.setAttribute('max', '100')
		styleInput.setAttribute('step', '5')
		styleInput.setAttribute('value', '50')
		styleInput.classList.add('days')
	}
	styleInput.classList.add('topic-row-style')
	// newStyleInput.append(styleInput)

	let cells = [topicInput, dateInput, styleInput]

	setSlider(styleInput)

	cells.forEach((cellContent, i) => {
		const newCell = newRow.insertCell(i)
		newCell.append(cellContent)
	})
}

function deleteRow() {
	try {
		const rowCount = topicTable.rows.length
		topicTable.deleteRow(rowCount - 1)
	} catch (e) {
		alert(e)
	}
}

function setCalcType(type) {
	document.getElementById('topic-calc-style').innerText = type == "diff" ? "Difficulty" : "Study Days"
}

// Function to calculate the exponential curve between two dates
function calculateCurveForDiff(startDate, endDate, difficultyFactor) {
    // Parse the dates to get the time in milliseconds
    const start = new Date(startDate).getTime();
	const end = new Date(endDate).getTime();
	
	console.log('Calculating Diff...')

    // Calculate the number of days between the two dates
	const daysBetween = (end - start)/1000/24/60/60;
	console.log(`Days Between: ${daysBetween}`)

	console.log(`Difficulty: ${difficultyFactor}`)
4
    // Determine the base number of points (minimum of 5) and adjust by difficulty factor
    const minPoints = 3;
    const maxPoints = Math.floor(daysBetween / 1.25);
    const numberOfPoints = minPoints + Math.floor((maxPoints - minPoints) * (difficultyFactor) / 4);

    // Constants for the exponential formula
    const a = 1; // Initial value
    const b = Math.pow(daysBetween, 1 / (numberOfPoints - 1)); // Base of the exponential

    // Generate the exponential curve values
    const exponentialValues = [];
    let lastValue = null;
    for (let i = 0; i < numberOfPoints; i++) {
        const x = i;
        const y = a * Math.pow(b, x);
        const roundedY = Math.round(y);
        if (roundedY !== lastValue) {
            exponentialValues.push(roundedY);
            lastValue = roundedY;
        }
    }

    return exponentialValues;
}


// Function to calculate the exponential curve between two dates
function calculateCurveForDays(startDate, endDate, numberOfValues) {
	// Parse the dates to get the time in milliseconds
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
	
    // Calculate the number of days between the two dates
    const daysBetween = (end - start)/1000/24/60/60;
	
    // Ensure the number of values is at least 2
	numberOfValues = Math.max(2, Math.ceil((numberOfValues / 100) * daysBetween));
	console.log(`Total Days: ${daysBetween}`)
	console.log(`Percentage: ${numberOfValues}`)
	console.log(`Percentage Study: ${(numberOfValues / 100) * daysBetween}`)
	console.log(`num of days: ${numberOfValues}`)
	
    // Constants for the exponential formula
    const a = 1; // Initial value
    const b = Math.pow(daysBetween, 1 / (numberOfValues - 1)); // Base of the exponential

    // Generate the exponential curve values
    const exponentialValues = new Set();
    for (let i = 0; exponentialValues.size < numberOfValues; i++) {
		const x = i;
        const y = a * Math.pow(b, x);
        const roundedY = Math.round(y);
        exponentialValues.add(roundedY);
    }
	
    // Convert Set to Array and return
    return Array.from(exponentialValues);
}

function setStyles(element, styles) {
    for(var s in styles) {
        element.style[s] = styles[s];
    }
}

function calculate() {
	let rows = topicTable.rows
	clearCal()
	testDateValue = new Date(testDate.value)

	for (var i = 1; i < rows.length; i++) {
		let cells = rows[i].cells
		let topicName
		let topicStart
		let topicCalc
		for (var k = 0; k < cells.length; k++) {
			if (k == 0) {
				topicName = cells[k].children[0].value == '' ? cells[k].children[0].placeholder : cells[k].children[0].value
			} else if (k == 1) {
				topicStart = new Date(cells[k].children[0].value)
			} else {
				topicCalc = cells[k].children[0].value
			}
		}

			//Calculate dates
			let results
			if (currentType == 'diff') {
				results = calculateCurveForDiff(topicStart, testDate.value, topicCalc)
			} else {
				results = calculateCurveForDays(topicStart, testDate.value, topicCalc)
			}

			for (var j in results) {
				let dateHolder = topicStart
				let nextDate = new Date(dateHolder.setDate(dateHolder.getDate() + results[j]))
				if (nextDate < testDateValue) {
					results[j] = nextDate
				} else if(((nextDate - testDateValue)/1000/24/60/60) >= (4*1000*60*60*24)) {
					results[j] = new Date(dateHolder.setDate(testDateValue.getDate()))
					break;
				}
			}

			for (var date of results) {
				addEvent(date, topicName)
			}
		}
	}


function sessionSave() {
	let saveString = `${testDate.value}()${currentType}()${currentRows}()`;
	let savedTopics = [];
	const topicNames = document.getElementsByClassName("topic-row-text");
	const topicDates = document.getElementsByClassName('topic-row-date')
	const topicCalcStyle = document.getElementsByClassName("topic-row-style");

	for (var k = 0; k < topicDates.length; k++) {
		savedTopics.push(
			`${topicNames[k].value}((${topicDates[k].value}((${topicCalcStyle[k].value}`
		);
	}

	savedTopics = savedTopics.join("))");

	saveString = saveString.concat(savedTopics);

	sessionStorage.setItem(`currentSession`, saveString);
}

function loadSave(saveName) {
	var saveData;
	if (saveName == "currentSession-thisisauniquestring123") {
		saveData = sessionStorage.getItem(`currentSession`);
	} else {
		saveData = localStorage.getItem(`${saveName}-saveFile`);
	}
	if (saveData == null) {
		return;
	}

	console.log(saveData)
	let data = saveData.split("()");
	let testdate = data[0];
	let calcType = data[1];
	let totalRows = data[2];
	let topics = data[3];

	let topicData = topics.split("))");

	testDate.value = testdate;
	// yearButton.checked = useyear == 1 ? true : false;
	numOfTopics.value = totalRows
	currentRows.value = totalRows;

	updateRows(totalRows);

	if (totalRows == 0) {
		return;
	} else {
		const topicNames = document.getElementsByClassName("topic-row-text");
		const topicDates = document.getElementsByClassName('topic-row-date')
		const topicDiff = document.getElementsByClassName("topic-row-style");

		for (var row in topicData) {
			let cells = topicData[row].split("((");

			let name = cells[0];
			let date = cells[1];
			let difficulty = cells[2];

			// let datevalues = date.split("-");
			// let year = datevalues[0];
			// let month = datevalues[1];
			// let day = datevalues[2];

			topicNames[row].value = name;
			topicDates[row].value = date
			topicDiff[row].value = difficulty;
		}
	}
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-= \\

// // Test the function with various date ranges and difficulty factors
// function testCalculateExponentialCurve() {
//     const startDate = "2024-06-26";

//     const testCases = [
//         { endDate: "2024-07-03", difficultyFactors: [1, 2, 3, 4, 5] },
//         { endDate: "2024-07-10", difficultyFactors: [1, 2, 3, 4, 5] },
//         { endDate: "2024-07-17", difficultyFactors: [1, 2, 3, 4, 5] },
//         { endDate: "2024-07-24", difficultyFactors: [1, 2, 3, 4, 5] },
//         { endDate: "2024-07-31", difficultyFactors: [1, 2, 3, 4, 5] }
//     ];

//     testCases.forEach(({ endDate, difficultyFactors }, index) => {
//         difficultyFactors.forEach(difficultyFactor => {
//             const result = calculateExponentialCurve(startDate, endDate, difficultyFactor);
//             console.log(`Test Case ${index + 1}, Difficulty ${difficultyFactor}:`);
//             console.log(`Start Date: ${startDate}`);
//             console.log(`End Date: ${endDate}`);
//             console.log(`Calculated Days Between: ${result[result.length - 1]}`);
//             console.log(`Exponential Values:`, result);
//             console.log('---');
//         });
//     });
// }