import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { FileProvider } from './context/FileProvider';
import { ReportResultProvider } from './context/ReportResultProvider';

// Create a theme instance for testing
const theme = createTheme();

beforeAll(() => {
  // Mock window.alert
  window.alert = jest.fn();
});

describe('App tests', () => {
  test('should render title on Interview page', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/interview']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    const titleElement = screen.getByText(
      /Generates follow-up interview questions based on the event debrief, witness statements, and other provided documents./i
    );
    expect(titleElement).toBeInTheDocument();
  });

  test('should not navigate to the app with the wrong trial code', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Enter the app from the main page
    // Find the trial code input and enter the correct code
    const trialCodeInput = screen.getByLabelText(/Enter Trial Code/i);
    fireEvent.change(trialCodeInput, { target: { value: 'incorrect-pass' } });

    // Click the "Get Started" button
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);

    // Should show error message and not navigate
    expect(screen.getByText(/Invalid trial code/i)).toBeInTheDocument();

    // Check that the navigation to the interview page did not occur
    expect(screen.queryByText(/Interview/i)).not.toBeInTheDocument();
  });

  test('should render Follow-up Interview link in the menu', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Enter the app from the main page
    // Find the trial code input and enter the correct code
    const trialCodeInput = screen.getByLabelText(/Enter Trial Code/i);
    fireEvent.change(trialCodeInput, { target: { value: 'iCAM-P@S5' } });

    // Click the "Get Started" button
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);

    // Expand the Evidence Collection menu
    const evidenceCollectionButton =
      screen.getAllByText(/Evidence Collection/i)[0];
    fireEvent.click(evidenceCollectionButton);

    const interviewLink = screen.getAllByText(/Follow-up Interview/i)[0];
    expect(interviewLink).toBeInTheDocument();
  });

  test('should render Select Files button in the UploadPanel', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Enter the app from the main page
    // Find the trial code input and enter the correct code
    const trialCodeInput = screen.getByLabelText(/Enter Trial Code/i);
    fireEvent.change(trialCodeInput, { target: { value: 'iCAM-P@S5' } });

    // Click the "Get Started" button
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);

    const uploadButton = screen.getByTestId('select-files-button');
    expect(uploadButton).toBeInTheDocument();
  });

  test('should show uploaded files in the UploadPanel', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Enter the app from the main page
    // Find the trial code input and enter the correct code
    const trialCodeInput = screen.getByLabelText(/Enter Trial Code/i);
    fireEvent.change(trialCodeInput, { target: { value: 'iCAM-P@S5' } });

    // Click the "Get Started" button
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
    });

    userEvent.upload(fileInput, file);

    const uploadedFile = screen.getByText(/example.pdf/i);
    expect(uploadedFile).toBeInTheDocument();
  });

  test('should disable SUBMIT button if no files are uploaded', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/interview']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('should render loading spinner when SUBMIT is clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/interview']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
    });

    userEvent.upload(fileInput, file);

    expect(screen.getByText('example.pdf')).toBeInTheDocument();

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  test.skip('should display discrepancy analysis response after form submission', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/discrepancies']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('discrepancy-summary')).toBeInTheDocument();
    });
  });

  test('should display interview response after form submission', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/interview']}>
          <FileProvider>
            <ReportResultProvider>
              <App />
            </ReportResultProvider>
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('interview-response-table')
      ).toBeInTheDocument();
    });
  });
});
