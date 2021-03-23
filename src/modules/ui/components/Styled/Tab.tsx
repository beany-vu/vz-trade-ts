import React from 'react';
import Tab from '@material-ui/core/Tab';
import styled from 'styled-components';

export default styled(Tab)`
  &.MuiTab-root {
    min-width: unset;
    text-transform: none;
    min-height: auto;
    line-height: 100%;
    padding: 10px 5px;
    font-family: var(--font-serif-primary);
    font-weight: var(--font-weight-semi-bold);
    opacity: 1;
  }
  &.Mui-selected {
    background: #efeae0;
    border-radius: 10px 10px 0 0;
  }
  .MuiTabs-indicator {
    display: none !important;
  }
  @media (min-width: 600px) {
    &.MuiTab-root {
      min-width: unset;
    }
  }
`;
