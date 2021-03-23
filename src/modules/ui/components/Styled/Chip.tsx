import React from 'react';
import Chip from '@material-ui/core/Chip';
import styled from 'styled-components';

export default styled(Chip)`
  &.MuiChip-colorPrimary {
    background: transparent;
    font-family: Roboto, sans-serif;
    font-weight: 600;
    font-size: 0.75em;
    color: #6b805e;
    border: 0;
    transition: all 0.1s ease-out;
    &:hover,
    &:focus {
      background: #6b805e;
      color: #fff;
    }
  }
  .MuiChip-deleteIconSmall {
    color: #6b805e;
  }
  .MuiChip-label {
    white-space: break-spaces;
  }
`;
