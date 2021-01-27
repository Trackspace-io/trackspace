import * as React from 'react';

/**
 * A component that detects whether the user clicked inside or outside of it.
 *
 * @param {{
 *  onClickInside: () => void,
 *  onClickOutside: () => void
 * }} props The props of the component.
 */

interface IClickHandlerProps {
  onClickInside?: () => void;
  onClickOutside: () => void;
}

const ClickHandler: React.FC<IClickHandlerProps> = ({ children, onClickInside, onClickOutside }) => {
  const node = React.useRef<HTMLDivElement>(null);

  // Register/Unregister a listener.
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  /**
   * Handles a click.
   *
   * @param {event} e The click event.
   */
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    if (node.current !== null && node.current.contains(target)) {
      onClickInside && onClickInside();
    } else {
      onClickOutside && onClickOutside();
    }
  };

  // Render the component.
  return <div ref={node}>{children}</div>;
};

export default ClickHandler;
