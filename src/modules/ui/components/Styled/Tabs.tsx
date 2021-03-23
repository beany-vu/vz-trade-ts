import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import styled from 'styled-components';

export default styled(Tabs)`
  &.MuiTabs-root {
    background: #f9f7f4;
    font-family: ${(props: { theme: { fontFamily: string } }) =>
      props.theme.fontFamily};
    font-size: 1.125em;
    color: #874e58;
    letter-spacing: 0;
    line-height: 24px;
    min-height: auto;
    padding-top: 10px;
  }
`;
