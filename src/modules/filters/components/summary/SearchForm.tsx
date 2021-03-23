import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchKeyword } from '../../selectors/keyword';
import { setSearchKeyword } from '../../reducer';

const Input = styled.input`
  min-width: 70px;
  outline: 0;
  border-radius: 50px;
  border: 1px solid #fff;
  padding: 2px 5px;
  &:hover,
  &:focus {
    border: 1px solid var(--color-border);
  }
`;

const SearchForm: FC = () => {
  const ref = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const searchKeyword = useSelector(selectSearchKeyword);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();

    dispatch(setSearchKeyword(event.target.value));
  };

  useEffect(() => {
    if (searchKeyword.length === 0 && ref.current !== undefined) {
      ref?.current?.focus();
    }
  }, [searchKeyword]);

  return (
    <Input
      ref={ref}
      value={searchKeyword}
      onChange={(event) => handleSearch(event)}
      placeholder="Keyword"
    />
  );
};

export default SearchForm;
