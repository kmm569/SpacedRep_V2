// Element list
let testDate = document.getElementsByName('testDate')[0]
let calcType = document.querySelector('#calcType')
let calcTypeLabels = document.querySelectorAll('.styled-label span')
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
}

testDate.addEventListener('change', () => {
	testDateValue = new Date(testDate.value)
})

calcTypeLabels.forEach((check) => {
	check.addEventListener('click', (ev) => {
		let parent = ev.target.parentElement
		if (parent.querySelector('input').checked == false) {
			parent.querySelector('input').checked = true
			setCalcType(parent.querySelector('input').value)
			currentType = parent.querySelector('input').value
			setRangeStyle()
		}
	})
})

const setRangeStyle = () => {
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

		if (slider.style.getPropertyValue('--sliderImage') == (null || "")) {
			slider.style.setProperty('--sliderImage', `url("${sliderDiffIconUrls[slider.value - 1]}")`)
		}

		slider.addEventListener('input', () => {
			slider.style.setProperty('--sliderImage', `url("${sliderDiffIconUrls[slider.value - 1]}")`)
		})
	} else {
		let date
		let max

		if (!testDateValue) date = today
		else date = testDateValue

		if (date == today) max = 100
		else {
			let distance = date - today
			max = distance / (1000 * 60 * 60 * 24)
		}
		slider.setAttribute('max', max)

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
	styleInput.setAttribute('min', '1')
	styleInput.setAttribute('max', '5')
	styleInput.setAttribute('value', '1')
	styleInput.classList.add('topic-row-style')
	styleInput.classList.add('diff')
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

    // Calculate the number of days between the two dates
    const daysBetween = (end - start) / (1000 * 60 * 60 * 24);

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
    const daysBetween = (end - start) / (1000 * 60 * 60 * 24);
	
    // Ensure the number of values is at least 2
    numberOfValues = Math.max(2, numberOfValues);
	
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