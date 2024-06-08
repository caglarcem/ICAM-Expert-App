import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

// Create a light theme instance for testing
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
});

describe('App tests', () => {
  test('should render "ICAM Expert" title on Home page', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const titleElement = screen.getByText(/ICAM Expert/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('should render "Hello world" title on Interview page', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/interview']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const titleElement = screen.getByText(/Hello world/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('should render "Please select the PDF documents and choose your tool" text on Home page', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const instructionElement = screen.getByText(
      /Please select the PDF documents and choose your tool/i
    );
    expect(instructionElement).toBeInTheDocument();
  });

  test('should render Home link in the menu', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();
  });

  test('should render Generate Interview link in the menu', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const interviewLink = screen.getByText(/Generate Interview/i);
    expect(interviewLink).toBeInTheDocument();
  });
});
