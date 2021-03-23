import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import { useDispatch } from 'react-redux';
import SelectionTree, { IData } from '../selection-tree';
import Summary from '../summary';
import { resetSearchKeyword } from '../../reducer';
import { Tab, Tabs } from '../../../ui/components/Styled';
import Overlay from '../../../ui/components/Overlay';

const TreeStyled = styled.div<{ isContentOpened: boolean }>`
  width: 335px;
  position: relative;
  margin: 10px 0;

  .icon {
    color: #864e5e;
  }

  z-index: ${(props) => (props.isContentOpened ? 1001 : 'auto')};
`;

const SelectionHeading = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  background: #fff;
  border-radius: var(--border-radius);
`;

const SelectionContent = styled.div<{ isOpened: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  overflow: hidden;
  background: var(--color-background);
  box-shadow: 3px 3px 0 0 #efeae0;
  border-radius: 0 0 15px 15px;
  opacity: ${(props) => (props.isOpened ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpened ? 'auto' : 'none')};
  z-index: 1001;
`;

const TabPanelStyled = styled.div`
  flex: 1 0 auto;
  padding: 10px 0 10px 0;
  overflow: scroll;
  overflow-x: hidden;
  margin-right: 3px;
  height: 250px;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: rgb(0 0 0 / 10%) 0 0 6px inset;
    background-color: #f4f1eb;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(157, 184, 145);
    border-radius: 15px;
  }
`;

interface IDataGroup {
  label: string;
  data: IData[];
  cascade: boolean;
}

const TabPanel: FC<{ value: string; index: string; children: ReactNode }> = ({
  value,
  index,
  children,
}) => {
  return (
    <TabPanelStyled
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
    >
      {value === index && (
        <div>
          <span>{children}</span>
        </div>
      )}
    </TabPanelStyled>
  );
};

const FilterContent: FC<{
  bgColor: string;
  icon: ReactNode | undefined;
  label: ReactNode | undefined;
  dataGroup: IDataGroup[];
  onChange: (data: IData[]) => void;
  onClose?: () => void;
  isOpenedByDefault?: boolean;
  multipleSelection: boolean;
  preSelected: IData[];
}> = ({
  bgColor,
  icon,
  label,
  dataGroup,
  onChange,
  multipleSelection,
  preSelected,
  isOpenedByDefault,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [currentTab, seCurrentTab] = useState<string>('tab0');
  const [isOpened, setOpened] = useState<boolean>(isOpenedByDefault === true);
  const [selected, setSelected] = useState<IData[]>(preSelected);

  const handleChange = (event: ChangeEvent<unknown>, newValue: string) =>
    seCurrentTab(newValue);

  const handleSelect: (changedNodes: IData[] | undefined) => void = (
    changedNodes
  ) => {
    const changedValues = changedNodes ? changedNodes.map((d) => d.value) : [];

    const selectedValues = selected.map((d) => d.value);

    if (changedNodes === undefined) return;

    if (!multipleSelection) {
      setSelected(
        selectedValues.includes(changedValues[0]) ? [] : changedNodes
      );
    } else if (changedValues.length === 0) {
      setSelected(changedNodes);
    } else if (
      changedNodes.every(({ value }) => selectedValues.includes(value))
    ) {
      // unselect a node
      setSelected(selected.filter((d) => !changedValues.includes(d.value)));
    } else {
      // select the nodes
      setSelected(Array.from(new Set([...selected, ...changedNodes])));
    }

    dispatch(resetSearchKeyword());
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  useEffect(() => {
    if (isOpened === false && typeof onClose === 'function') {
      onClose();
    }
  }, [isOpened]);

  return (
    <TreeStyled isContentOpened={isOpened}>
      <div className="wrapper">
        <SelectionHeading
          style={{ backgroundColor: bgColor }}
          onClick={() => setOpened(true)}
        >
          <div className="icon">{icon}</div>
          <Summary
            label={label}
            isOpened={isOpened}
            selected={selected}
            deselectAnItem={(key: IData[] | undefined) => handleSelect(key)}
          />
        </SelectionHeading>
        <SelectionContent isOpened={isOpened}>
          <AppBar position="sticky">
            <Tabs
              value={currentTab}
              onChange={handleChange}
              variant="fullWidth"
              scrollButtons="auto"
              TabIndicatorProps={{
                style: {
                  display: 'none',
                },
              }}
            >
              {dataGroup.map((d, index) => (
                <Tab
                  value={`tab${index}`}
                  key={`tab${index}`}
                  label={d.label}
                />
              ))}
            </Tabs>
          </AppBar>
          {dataGroup.map((d, index) => (
            <TabPanel
              value={currentTab}
              index={`tab${index}`}
              key={`tab${index}`}
            >
              <div className="inner-wrapper">
                <SelectionTree
                  dataSource={d.data}
                  selected={selected}
                  handleSelect={handleSelect}
                  multipleSelection={multipleSelection}
                />
              </div>
            </TabPanel>
          ))}
        </SelectionContent>
      </div>
      {isOpened && (
        <>
          <RemoveScrollBar />
          <Overlay onClick={() => setOpened(false)} />
        </>
      )}
    </TreeStyled>
  );
};

export default FilterContent;
