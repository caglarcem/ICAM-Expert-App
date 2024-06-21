import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

interface InterviewResponseFormatterProps {
  text: string;
}

const InterviewResponseFormatter: React.FC<InterviewResponseFormatterProps> = ({
  text,
}) => {
  console.log('response formattera geliyor mu');

  const parseText = (input: string) => {
    if (!input) return <></>;

    const boldRegex = /<b>(.*?)<\/b>/g;
    const newlineRegex = /<\/n>/g;
    const bulletRegex = /\*/g;
    const numberBulletRegex = /^(\d+\.\s)/gm;

    // Split the input text by newline indicators
    const segments = input.split(newlineRegex);
    const parsedSegments = segments.map((segment, index) => {
      const parts = [];
      let lastIndex = 0;

      // Process each segment to identify bold parts
      segment.replace(boldRegex, (match, p1, offset) => {
        // Push the non-bold text before the bold part
        if (offset > lastIndex) {
          let nonBoldText = segment
            .substring(lastIndex, offset)
            .replace(bulletRegex, '•');
          // Indent bullet points and numbered points
          if (
            numberBulletRegex.test(nonBoldText) ||
            nonBoldText.includes('•')
          ) {
            nonBoldText = '\t' + nonBoldText;
          }
          parts.push(
            <Typography
              key={`${index}-${lastIndex}`}
              component="div"
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                lineHeight: 1.5,
              }}
            >
              {nonBoldText}
            </Typography>
          );
        }
        // Push the bold text
        parts.push(
          <Typography
            key={`${index}-${offset}`}
            component="div"
            style={{
              fontWeight: 'bold',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              lineHeight: 1.5,
            }}
          >
            {p1}
          </Typography>
        );
        lastIndex = offset + match.length;
        return match;
      });

      // Push any remaining non-bold text after the last bold part
      if (lastIndex < segment.length) {
        let remainingText = segment
          .substring(lastIndex)
          .replace(bulletRegex, '•');
        // Indent bullet points and numbered points
        if (
          numberBulletRegex.test(remainingText) ||
          remainingText.includes('•')
        ) {
          remainingText = '\t' + remainingText;
        }
        parts.push(
          <Typography
            key={`${index}-${lastIndex}`}
            component="div"
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              lineHeight: 1.2,
            }}
          >
            {remainingText}
          </Typography>
        );
      }

      return <Box key={index}>{parts}</Box>;
    });

    return parsedSegments;
  };

  return <Box>{parseText(text)}</Box>;
};

export default InterviewResponseFormatter;
