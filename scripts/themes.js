const activeStyle = document.getElementById('themeStyle')
let storedTheme = localStorage.getItem('theme')
let themeButton = document.getElementById('theme');

activeStyle.href = `./styles/themes/${storedTheme ? storedTheme : "dutchess"}.css`

window.onload = () => {
	const openTheme = document.querySelector('[theme-open-modal]')
	const themeModal = document.querySelector('[theme-modal]')
	const themeValue = document.querySelector('[data-theme]')


	openTheme.addEventListener('click', () => {
		themeModal.showModal()
		themeValue.value = localStorage.getItem('theme') ? localStorage.getItem('theme') : "dutchess"
	})
	
	themeModal.addEventListener('close', () => {
		localStorage.setItem('theme', themeValue.value)
		activeStyle.href = `./styles/themes/${themeValue.value ? themeValue.value : "dutchess"}.css`
	})

	themeModal.addEventListener('click', e => {
		const dialogDimensions = themeModal.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            themeModal.close()
        }
	})

}