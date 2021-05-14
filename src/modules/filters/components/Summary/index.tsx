import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SearchIcon from '@material-ui/icons/Search';
import SearchForm from './SearchForm';
import { Chip } from '../../../ui/components/Styled';
import { IData } from '../SelectionTree';

const SummaryStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
  height: 55px;
  width: 100%;
  justify-content: space-between;
  &.opened {
    //height: 100px;
  }

  .summary {
    padding-left: 10px;
  }

  .placeholder {
    font-famiy: var(--font-sans-serif-primary);
    font-size: 0.75em;
    color: #918b86;
    line-height: 16px;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding-left: 10px;
  > span {
    text-align: left;
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
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  //max-height: 55px;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  &.opened {
    overflow-y: scroll;
    max-height: unset;
  }
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
  summaryText: ReactNode | string | undefined;
  isOpened: boolean;
  deselectAnItem: (strings: IData[] | undefined) => void;
}> = ({ selected, label, summaryText, isOpened, deselectAnItem }) => {
  const onDelete = (event: React.SyntheticEvent, key: string[]) => {
    event.preventDefault();
    deselectAnItem(selected.filter((d) => key.includes(d.value)));
  };
  return (
    <SummaryStyled className={isOpened ? 'opened' : ''}>
      <ListWrapper
        style={{
          flexDirection: isOpened ? 'row' : 'column',
        }}
      >
        <span>
          {label && <div className="placeholder">{label}</div>}
          {isOpened && (
            <SearchIconStyled>
              <SearchIcon />
            </SearchIconStyled>
          )}
        </span>
        {/* @todo think about scroll to bottom when selection changes to make sure that user will always see the input */}
        <SelectedList className={isOpened ? 'opened' : ''}>
          {!isOpened && summaryText && selected.length > 1 && (
            <>{summaryText}</>
          )}
          {!isOpened &&
            (!summaryText || selected.length === 1) &&
            selected.map((d: IData) => (
              <Chip
                size="small"
                key={d.value}
                label={d?.label}
                clickable
                color="primary"
                onDelete={(event) => onDelete(event, [d?.value])}
              />
            ))}
          {isOpened && (
            <>
              <SearchForm />
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
            </>
          )}
        </SelectedList>
      </ListWrapper>
      <DropdownIconStyled>
        <KeyboardArrowDownIcon />
      </DropdownIconStyled>
    </SummaryStyled>
  );
};

export default Summary;
