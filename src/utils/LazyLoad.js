import React, { Component as ReactComponent } from 'react';
import throttle from 'lodash/throttle';

/**
 * A higher order component (HOC) that lazy loads the current element and provides
 * dimensions to the wrapped component as a `dimensions` prop that has
 * the shape `{ width: 600, height: 400}`.
 *
 * @param {React.Component} Component to be wrapped by this HOC
 * @param {Object} options pass in options like maxWidth and maxHeight. To load component after
 * initial rendering has passed or after user has interacted with the window (e.g. scrolled),
 * use`loadAfterInitialRendering: 1500` (value should be milliseconds).
 *
 * @return {Object} HOC component which knows its dimensions
 */
export const lazyLoadWithDimensions = (Component, options = {}) => {
  // The resize event is flooded when the browser is resized. We'll
  // use a small timeout to throttle changing the viewport since it
  // will trigger rerendering.
  const THROTTLE_WAIT_MS = 200;
  // First render default wait after mounting (small wait for styled paint)
  const RENDER_WAIT_MS = 100;

  // Scrolling and other events that affect to viewport location have this safety margin
  // for lazy loading
  const NEAR_VIEWPORT_MARGIN = 50;

  class LazyLoadWithDimensionsComponent extends ReactComponent {
    constructor(props) {
      super(props);
      this.element = null;
      this.defaultRenderTimeout = null;
      this.afterRenderTimeout = null;

      this.state = { width: 0, height: 0 };

      this.handleWindowResize = throttle(this.handleWindowResize.bind(this), THROTTLE_WAIT_MS);
      this.isElementNearViewport = this.isElementNearViewport.bind(this);
      this.setDimensions = this.setDimensions.bind(this);
    }

    componentDidMount() {
      window.addEventListener('scroll', this.handleWindowResize);
      window.addEventListener('resize', this.handleWindowResize);
      window.addEventListener('orientationchange', this.handleWindowResize);

      this.defaultRenderTimeout = window.setTimeout(() => {
        if (this.isElementNearViewport(0)) {
          this.setDimensions();
        } else {
          const loadAfterInitialRendering = options.loadAfterInitialRendering;
          if (typeof loadAfterInitialRendering === 'number') {
            this.afterRenderTimeout = window.setTimeout(() => {
              window.requestAnimationFrame(() => {
                this.setDimensions();
              });
            }, loadAfterInitialRendering);
          }
        }
      }, RENDER_WAIT_MS);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleWindowResize);
      window.removeEventListener('resize', this.handleWindowResize);
      window.removeEventListener('orientationchange', this.handleWindowResize);
      window.clearTimeout(this.defaultRenderTimeout);

      if (this.afterRenderTimeout) {
        window.clearTimeout(this.afterRenderTimeout);
      }
    }

    handleWindowResize() {
      const shouldLoadToImproveScrolling = typeof options.loadAfterInitialRendering === 'number';
      if (this.isElementNearViewport(NEAR_VIEWPORT_MARGIN) || shouldLoadToImproveScrolling) {
        window.requestAnimationFrame(() => {
          this.setDimensions();
        });
      }
    }

    setDimensions() {
      this.setState(prevState => {
        const { clientWidth, clientHeight } = this.element || { clientWidth: 0, clientHeight: 0 };
        return { width: clientWidth, height: clientHeight };
      });
    }

    isElementNearViewport(safetyBoundary) {
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
          (rect.top >= 0 && rect.top <= viewportHeight + safetyBoundary) ||
          (rect.bottom >= -1 * safetyBoundary && rect.bottom <= viewportHeight)
        );
      }
      return false;
    }

    render() {
      const dimensions = this.state;
      const { width, height } = dimensions;
      const props = { ...this.props, dimensions };

      // lazyLoadWithDimensions HOC needs to take all given space
      // unless max dimensions are provided through options.
      const { maxWidth, maxHeight } = options;
      const maxWidthMaybe = maxWidth ? { maxWidth } : {};
      const maxHeightMaybe = maxHeight ? { maxHeight } : {};
      const style =
        maxWidth || maxHeight
          ? { width: '100%', height: '100%', ...maxWidthMaybe, ...maxHeightMaybe }
          : { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

      return (
        <div
          ref={element => {
            this.element = element;
          }}
          style={style}
        >
          {width !== 0 && height !== 0 ? <Component {...props} /> : null}
        </div>
      );
    }
  }

  LazyLoadWithDimensionsComponent.displayName = `lazyLoadWithDimensions(${Component.displayName ||
    Component.name})`;

  return LazyLoadWithDimensionsComponent;
};
