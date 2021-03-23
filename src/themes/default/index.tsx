import React, { FC, ReactNode } from 'react';
import {
  createMuiTheme,
  ThemeOptions,
  ThemeProvider,
} from '@material-ui/core/styles';

const theme: ThemeOptions = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiChip: {},
  },
});

export const ThemeContext = React.createContext<
  Partial<{
    cssVars: Record<string, unknown> | undefined;
  }>
>({});

const DefaultTheme: FC<{
  cssVars?: Record<string, unknown> | undefined;
  children: ReactNode;
}> = ({ cssVars, children }) => {
  return (
    <ThemeContext.Provider value={{ cssVars }}>
      {cssVars && (
        <div style={cssVars}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </div>
      )}
      {!cssVars && <ThemeProvider theme={theme}>{children}</ThemeProvider>}
    </ThemeContext.Provider>
  );
};

export default DefaultTheme;
