import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FormattedMessage } from 'react-intl';
import { FlexWrapper, StyledButton, PrintWrapper } from './styled';
import Print from 'views/Print';

export const PrintButton: React.FC = () => {
  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <FlexWrapper>
      <StyledButton onClick={handlePrint}>
        <FormattedMessage id={'app.print'} />
      </StyledButton>
      <div style={{ display: 'none' }}>
        <PrintWrapper ref={ref}>
          <Print />
        </PrintWrapper>
      </div>
    </FlexWrapper>
  );
};

export default PrintButton;
