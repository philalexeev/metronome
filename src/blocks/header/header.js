export function openMenu() {
	let menu = document.querySelector('.nav');
	let openMenuBtn = document.querySelector('.nav-open-btn');

	openMenuBtn.addEventListener('click', () => {
		menu.classList.add('nav--open');
	});
}

export function closeMenu() {
	let menu = document.querySelector('.nav');
	let closeMenuBtn = document.querySelector('.nav-close-btn');

	closeMenuBtn.addEventListener('click', () => {
		menu.classList.remove('nav--open');
	});
}
