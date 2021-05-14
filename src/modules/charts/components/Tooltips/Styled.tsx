import styled from 'styled-components';

export const TooltipStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border: 1px solid #efeae0;
  box-shadow: 5px 5px 0 0 #efeae0;
  border-radius: 5px;
  padding: 25px 15px;

  .separator {
    position: relative;
    border: 1px solid #706d6d;
    margin: 10px auto;
    width: 170px;

    .middle-point {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #706d6d;
    }

    &:after,
    &:before {
      position: absolute;
      display: block;
      content: '';
      top: 50%;
      transform: translate(0, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #706d6d;
    }

    &:before {
      left: -6px;
    }

    &:after {
      right: -6px;
    }
  }
`;

export const Value = styled.span`
  display: block;
  font-family: var(--font-sans-serif-primary);
  font-weight: bold;
  font-size: 26px;
  color: #554f44;
  text-align: center;
  line-height: 19px;
  margin: 0 5px;
`;

export const Label = styled.span`
  font-family: var(--font-sans-serif-primary);
  font-weight: bold;
  font-size: 10px;
  color: #554f44;
  text-align: center;
  line-height: 22px;
  text-transform: uppercase;
`;

export const DateFormatted = styled.span`
  display: block;
  font-family: var(--font-sans-serif-primary);
  font-size: 10px;
  color: #706d6d;
  line-height: 19px;
`;

export const Difference = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
`;

export const Trend = styled.div<{ trend: string }>`
  text-align: center;
  font-family: var(--font-sans-serif-primary);
  font-size: 10px;
  font-weight: bold;
  color: ${(props) => (props.trend === 'upward' ? '#3BAF33' : '#FF4646')};
`;
