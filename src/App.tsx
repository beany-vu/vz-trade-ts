import React, { FC } from 'react';
import styled from 'styled-components';

const AppStyled = styled.div`
  background: pink;
`;

const App: FC = () => {
  return (
    <AppStyled>
      <p>VZ trade!!!</p>
    </AppStyled>
  );
};

export default App;
