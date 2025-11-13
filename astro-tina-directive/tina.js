/**
 * Hydrate on first click on the window
 * @type {import('astro').ClientDirective}
 */
// eslint-disable-next-line no-unused-vars
export default (load, _opts, _el) => {
  try {
    // Only hydrate when inside an iframe (TinaCMS visual editor)
    if (window.self === window.top) {
      return;
    }

    // Load and hydrate the component
    (async () => {
      const hydrate = await load();
      await hydrate();
    })();
  } catch (error) {
    console.error('Error in the Tina client directive:', error);
  }
};
