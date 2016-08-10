/* eslint-env browser */

const menu = document.querySelector('.menu.outside');
const toggle = menu.querySelector('.toggle')

toggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  menu.classList.toggle('show');
});
