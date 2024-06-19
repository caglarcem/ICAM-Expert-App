import React from 'react';
import Typography from '@mui/material/Typography';

interface InterviewResponseFormatterProps {
  text: string;
}

const InterviewResponseFormatter: React.FC<InterviewResponseFormatterProps> = ({
  text,
}) => {
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
              component="span"
              style={{ whiteSpace: 'pre' }}
            >
              {nonBoldText}
            </Typography>
          );
        }
        // Push the bold text
        parts.push(
          <Typography
            key={`${index}-${offset}`}
            component="span"
            style={{ fontWeight: 'bold' }}
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
            component="span"
            style={{ whiteSpace: 'pre' }}
          >
            {remainingText}
          </Typography>
        );
      }

      return (
        <div key={index}>
          {parts}
          <br />
        </div>
      );
    });

    return parsedSegments;
  };

  return <div>{parseText(text)}</div>;
};

export default InterviewResponseFormatter;
