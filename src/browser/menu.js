/* eslint-env browser */

const menu = document.querySelector('.menu.outside');
const toggle = menu.querySelector('.toggle');

toggle.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// delay rendering carbon ads by 500ms to make sure they don't slow down page load
setTimeout(() => {
  const script = document.createElement('script');
  const container = document.querySelector('.menu.inside .advert');
  script.async=true;
  script.src="//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=pugjsorg";
  script.id="_carbonads_js";
  container.appendChild(script);
}, 500);
