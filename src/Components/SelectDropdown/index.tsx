import React, { useRef } from 'react';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { useAppDispatch } from '~/redux/store';
import { IDropdownOption } from '~/types/post';
import { SetState } from '~/types/utils';
import '~/Components/SelectDropdown/SelectDropdown.scss'

const SelectDropdown = ({ isActive, setSelectedItem, items = [] }: ISelectDropdownProps) => {
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();

  const selectItem = (item: IDropdownOption) => {
    setSelectedItem(item);
    dispatch(updatePostItem({ privacy: item.topText }));
  };
  return (
    <div className="menu-container" data-testid="menu-container">
      <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
        <ul>
          {items.map((item, index) => (
            <li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SelectDropdown;

export interface ISelectDropdownProps {
  isActive: boolean;
  setSelectedItem: SetState<IDropdownOption>;
  items: Array<IDropdownOption>;
}
