// Stolen from Modernizr (MIT license)

/* eslint-disable xo/catch-error-name no-implicit-coercion */
const tests = {
  templatestrings: () => {
    let supports;
    try {
      // A number of tools, including uglifyjs and require, break on a raw "`", so
      // use an eval to get around that.
      // eslint-disable-next-line
      eval('``');
      supports = true;
    } catch (e) {}
    return !!supports;
  }
};
/* eslint-enable xo/catch-error-name no-implicit-coercion */

export default funcs => funcs.every(func => tests[func]());
