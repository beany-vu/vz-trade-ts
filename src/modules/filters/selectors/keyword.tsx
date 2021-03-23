import { createSelector } from 'reselect';

const getSearchKeyword = (state: { searchKeyword: string }) =>
  state.searchKeyword;

export const selectSearchKeyword = createSelector(
  getSearchKeyword,
  (data) => data
);
