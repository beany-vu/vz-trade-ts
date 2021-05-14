import styled from 'styled-components';

export const CheckboxTreeStyled = styled.div`
  ol ol {
    padding-left: 15px;
  }
  ol li {
    padding: 5px 0;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-accent);
    font-family: var(--font-serif-primary);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size);
  }

  .rct-node-expanded {
    position: relative;
    border-bottom: 0;
  }

  .rct-node-expanded .rct-checkbox {
    &:before {
      content: '';
      position: absolute;
      left: 11px;
      top: 25px;
      width: 1px;
      background: var(--color-border);
      height: calc(100% - 30px);
      z-index: -1;
    }
  }

  .rct-node-leaf {
    .rct-collapse {
      width: 0;
    }
  }

  .rct-node-clickable {
    padding-left: 25px;
    transform: translate(-25px, -1px);
    order: -1;
    &:hover,
    &:focus {
      background: unset;
    }
    .rct-node-icon {
      display: none;
    }
  }

  .rct-checkbox {
    pointer-events: none;
  }

  .rct-collapse.rct-collapse-btn {
    cursor: pointer;
    margin-left: auto;
  }

  label {
    display: flex;
    margin-top: 2px;
    order: -2;
  }
`;
