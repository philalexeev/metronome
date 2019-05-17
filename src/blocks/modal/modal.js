let btnOpen = document.querySelector('.open'); //your elem to open modal
let btnClose = document.querySelector('.close');
let modal = document.querySelector('.modal');
let modalContent = document.querySelector('.modal__content');
let modalContentOpen = document.querySelector('.modal__content--open');

function addOpenClass() {
  let contentHeight = parseInt(getComputedStyle(modalContent).height);
  let modalHeight = parseInt(getComputedStyle(modal).height);

  if (contentHeight > modalHeight) {
		modalContent.classList.add('modal__content--openup');
  } else {
		modalContent.classList.add('modal__content--open');
  }
}

function closeModals() {
	modal.classList.add('modal--close');
  document.body.classList.remove('blocked');
	if (modalContent.classList.contains('modal__content--open')) {
		modalContent.classList.add('modal__content--close');
	} else {
		modalContent.classList.add('modal__content--closeup');
	}

}

function removeClasses() {
	modal.classList.remove('modal--open', 'modal--close');
	modalContent.classList.remove('modal__content--open', 'modal__content--openup', 'modal__content--close', 'modal__content--closeup');
}

btnOpen.addEventListener('click', () => {
  modal.classList.add('modal--open');
	addOpenClass();
	modal.scrollTo(0, 0);
  document.body.classList.add('blocked');
});

btnClose.addEventListener('click', () => {
  closeModals();
	setTimeout(removeClasses, 800);
});

modal.addEventListener('click', (e) => {
  let target = e.target;
  if (target === modal) {
    closeModals();
		setTimeout(removeClasses, 800);
  }
});
