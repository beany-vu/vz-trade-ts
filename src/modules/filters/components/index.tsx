import React, { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import filtersReducer from '../reducer';
import FilterContent from './filter-content';
// import { createStore } from 'redux';

interface INode {
  value: string;
  label: string;
  children?: INode[];
}

const Filter: FC<{
  bgColor: string;
  icon?: ReactNode;
  label?: ReactNode;
  dataGroup: [];
  multipleSelection: boolean;
  onChange: (data: INode[]) => void;
  preSelected: INode[];
}> = ({
  bgColor = '#ffffff',
  icon,
  dataGroup,
  onChange,
  multipleSelection,
  preSelected,
  label,
  ...otherProps
}) => {
  const store = configureStore({
    reducer: filtersReducer,
    devTools: {
      name: 'Visualization for trade',
    },
  });

  return (
    <Provider store={store}>
      <FilterContent
        bgColor={bgColor}
        icon={icon || <PublicRoundedIcon width={55} height={55} />}
        label={label}
        dataGroup={dataGroup}
        onChange={onChange}
        multipleSelection={multipleSelection}
        preSelected={preSelected}
        {...otherProps}
      />
    </Provider>
  );
};

export default Filter;
