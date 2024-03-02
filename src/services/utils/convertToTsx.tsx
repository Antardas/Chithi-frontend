import React from 'react';
import { IconType } from 'react-icons';
interface Props {
  className: string;
}
function ConvertToJSX(Element: IconType, props: Props): JSX.Element {
  return <Element {...props}></Element>;
}
export { ConvertToJSX };
