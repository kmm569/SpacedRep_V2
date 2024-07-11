let calcType = document.querySelector('#calcType')
let calcTypeLabels = document.querySelectorAll('.styled-label span')

calcTypeLabels.forEach((check) => {
	check.addEventListener('click', (ev) => {
		let parent = ev.target.parentElement
		if (parent.querySelector('input').checked == false) {
			parent.querySelector('input').checked = true
			console.log("clicked radio button")
			// setCalcType(parent.querySelector('input').value)
			// currentType = parent.querySelector('input').value
			// setRangeStyle()
		}
	})
})