import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import React from 'react';

interface RcaSummaryProps {
  text: string;
}

const RcaSummary: React.FC<RcaSummaryProps> = ({ text }) => {
  const parseText = (input: string) => {
    if (!input) return <></>;

    const boldRegex = /<b>(.*?)<\/b>/g;
    const newlineRegex = /<\/n>/g;
    const segments = input.split(newlineRegex);

    return segments.map((segment, index) => {
      const parts = [];
      let lastIndex = 0;

      segment.replace(boldRegex, (match, p1, offset) => {
        if (offset > lastIndex) {
          parts.push(
            <Typography key={`${index}-${lastIndex}`} component="span">
              {segment.substring(lastIndex, offset)}
            </Typography>
          );
        }
        parts.push(
          <Typography
            key={`${index}-${offset}`}
            component="span"
            sx={{ fontWeight: 'bold', fontSize: '16px' }}
          >
            {p1}
          </Typography>
        );
        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < segment.length) {
        parts.push(
          <Typography key={`${index}-${lastIndex}`} component="span">
            {segment.substring(lastIndex)}
          </Typography>
        );
      }

      return (
        <Box key={index} sx={{ marginTop: 3 }}>
          {parts}
        </Box>
      );
    });
  };

  return <Box>{parseText(text)}</Box>;
};

export default RcaSummary;
