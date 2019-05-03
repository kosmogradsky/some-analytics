import * as React from 'react';
import { History, Location, createLocation, LocationDescriptor } from "history";
import { ValueConstructor } from 'sudetenwaltz';

export class RequestUrlChange implements ValueConstructor {
  readonly type = 'RequestUrlChange'

  constructor(readonly location: Location) {}
}

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: LocationDescriptor;
  innerRef?: (node: HTMLAnchorElement | null) => void;
}

export const createLink = function<A>(
  history: History,
  dispatch: (action: A | RequestUrlChange) => void
) {
  return class Link extends React.Component<LinkProps> {
    handleClick(
      event: React.MouseEvent<HTMLAnchorElement>,
      toLocation: Location
    ) {
      if (this.props.onClick) { this.props.onClick(event); }

      if (
        !event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore everything but left clicks
        (!this.props.target || this.props.target === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault();

        dispatch(new RequestUrlChange(toLocation));
      }
    }

    render() {
      const { innerRef, to, ...rest } = this.props;   
      const toLocation = createLocation(to);
      const href = history.createHref(toLocation);

      return (
        <a
          {...rest}
          onClick={event => this.handleClick(event, toLocation)}
          href={href}
          ref={innerRef}
        />
      );
    }
  }
}