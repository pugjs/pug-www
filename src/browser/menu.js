/* eslint-env browser */

const menu = document.querySelector('.menu.outside');
const toggle = menu.querySelector('.toggle');

toggle.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// Delay rendering carbon ads by 500ms to make sure they don't slow down page load
setTimeout(() => {
  // Render Carbon Ads
  const script = document.createElement('script');
  const container = document.querySelector('.menu.inside .advert');
  script.async = true;
  script.src = '//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=pugjsorg';
  script.id = '_carbonads_js';
  container.appendChild(script);

  // Render e-mail list signup form
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//forms.aweber.com/form/06/692213006.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "aweber-wjs-fhbbgl26s"));
}, 500);
