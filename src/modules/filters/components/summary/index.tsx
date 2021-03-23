import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SearchIcon from '@material-ui/icons/Search';
import SearchForm from './SearchForm';
import { Chip } from '../../../ui/components/Styled';
import { IData } from '../selection-tree';

const SummaryStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
  height: 55px;
  width: 100%;
  justify-content: space-between;

  .summary {
    padding-left: 10px;
  }

  .placeholder {
    font-famiy: var(--font-sans-serif-primary);
    font-size: 0.75em;
    color: #918b86;
    line-height: 16px;
  }

  .list-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 10px;
  }
`;

const DropdownIconStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 30px;
  max-width: 30px;
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--border-radius);
  color: #fff;
  pointer-events: none;
  cursor: pointer;
`;

const SearchIconStyled = styled.div`
  color: var(--color-text-lightest);
`;

const SelectedList = styled.div`
  max-height: 55px;
  overflow-y: scroll;
  width: 100%;
  cursor: pointer;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: rgb(0 0 0 / 0.5%) 0 0 6px inset;
    background-color: #f4f1eb;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--color-highlight);
    border-radius: 15px;
  }

  > * {
    margin-right: 5px;
  }
`;

const Summary: FC<{
  label: ReactNode | undefined;
  selected: IData[];
  isOpened: boolean;
  deselectAnItem: (strings: IData[] | undefined) => void;
}> = ({ selected, label, isOpened, deselectAnItem }) => {
  const onDelete = (event: React.SyntheticEvent, key: string[]) => {
    event.preventDefault();
    deselectAnItem(selected.filter((d) => key.includes(d.value)));
  };

  return (
    <SummaryStyled>
      <div className="list-wrapper">
        <span>
          {label && <div className="placeholder">{label}</div>}
          <SearchIconStyled>
            <SearchIcon />
          </SearchIconStyled>
        </span>
        {/* @todo think about scroll to bottom when selection changes to make sure that user will always see the input */}
        <SelectedList>
          {selected.map((d: IData) => (
            <Chip
              size="small"
              key={d.value}
              label={d?.label}
              clickable
              color="primary"
              onDelete={(event) => onDelete(event, [d?.value])}
            />
          ))}
          {isOpened && <SearchForm />}
        </SelectedList>
      </div>
      <DropdownIconStyled>
        <KeyboardArrowDownIcon />
      </DropdownIconStyled>
    </SummaryStyled>
  );
};

export default Summary;
