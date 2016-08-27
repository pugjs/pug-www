// Stolen from Modernizr (MIT license)

const tests = {
  templatestrings: () => {
    let supports = false;
    try {
      // A number of tools, including uglifyjs and require, break on a raw "`", so
      // use an eval to get around that.
      // eslint-disable-next-line no-eval
      eval('``');
      supports = true;
    } catch (err) {}
    return supports;
  }
};

export default funcs => funcs.every(func => tests[func]());
