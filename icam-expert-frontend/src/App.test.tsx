import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { FileProvider } from './context/FileProvider';

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
            <App />
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    const titleElement = screen.getByText(
      /Generates follow up interview questions based on the event debrief, witness statements and other provided documents./i
    );
    expect(titleElement).toBeInTheDocument();
  });

  test('should render Generate Interview link in the menu', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <App />
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    const interviewLink = screen.getByText(/Generate Interview/i);
    expect(interviewLink).toBeInTheDocument();
  });

  test('should render Select Files button in the UploadPanel', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <App />
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    const uploadButton = screen.getByTestId('select-files-button');
    expect(uploadButton).toBeInTheDocument();
  });

  test('should show uploaded files in the UploadPanel', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <FileProvider>
            <App />
          </FileProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

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
            <App />
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
            <App />
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

  test('should display result after form submission', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/interview']}>
          <FileProvider>
            <App />
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
      expect(screen.getByTestId('report-result')).toBeInTheDocument();
    });
  });
});
