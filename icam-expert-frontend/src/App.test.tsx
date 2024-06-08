import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('should render "ICAM Expert" title on Home page', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/ICAM Expert/i);
  expect(titleElement).toBeInTheDocument();
});

test('should render "Hello world" title on Expert page', () => {
  render(
    <MemoryRouter initialEntries={['/expert']}>
      <App />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/Hello world/i);
  expect(titleElement).toBeInTheDocument();
});

test('should render "Please select the PDF documents and choose your tool" text on Menu', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const instructionElement = screen.getByText(
    /Please select the PDF documents and choose your tool/i
  );
  expect(instructionElement).toBeInTheDocument();
});
