import { useState } from 'react';
import '~/Components/Toggle/Toggle.scss';
let i = 0;
const Toggle = ({ toggle, onClick }: IProps) => {
  // const [toggleValue, setToggleValue] = useState(toggle);
  i++;
  return (
    /*<div onClick={onClick} >*/
    <label className="switch" htmlFor={`switch-${i}`} data-testid="toggle" /* onClick={(event) => event.stopPropagation()} */>
      <input
        id={`switch-${i}`}
        name={`switch-${i}`}
        type="checkbox"
        onChange={(event) => {
          onClick(event);
        }}
        checked={toggle}
      />
      <span className="slider round"></span>
    </label>
    // </div>
  );
};

interface IProps {
  toggle: boolean;
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default Toggle;
