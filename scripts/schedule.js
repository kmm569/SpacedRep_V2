// Element list
let testDate = document.getElementsByName('testDate')[0]
let calcType = document.querySelector('#calcType')

testDate.addEventListener('change', () => {
	console.log(testDate.value)
})

calcType.addEventListener('input', (ev) => {
	console.log(ev)
})

console.log(calcType)