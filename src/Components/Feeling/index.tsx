import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { IFeeling, feelingsList } from '~/services/utils/static.data';
import '~/Components/Feeling/Feelings.scss';
import { addPostFeeling, toggleFeelingModal } from '~/redux/reducers/modal/modal.reducer';

const Feelings = () => {
  const { feelingsIsOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useAppDispatch();

  const selectFeeling = (feeling: IFeeling) => {
    dispatch(addPostFeeling(feeling));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };
  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr />
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li className="feelings-container-picker-list-item" key={feeling.index} onClick={() => selectFeeling(feeling)}>
              <img src={feeling.image} alt="" />
              <span> {feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Feelings;
