import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText('mm/dd/yyyy');
  const element = screen.getByRole('button', {name: /Add/i});

  // Add a task
  fireEvent.change(inputTask, { target: { value: 'History Test' } });
  fireEvent.change(inputDate, { target: { value: '05/30/2024' } });
  fireEvent.click(element);

  // Try to add the same task again
  fireEvent.change(inputTask, { target: { value: 'History Test' } });
  fireEvent.change(inputDate, { target: { value: '05/30/2024' } });
  fireEvent.click(element);

  // Ensure only one task with 'History Test' is rendered
  const taskElements = screen.getAllByText(/History Test/i);
  expect(taskElements.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);

  const inputDate = screen.getByPlaceholderText('mm/dd/yyyy');
  const addButton = screen.getByTestId('new-item-button'); // Use data-testid

  // Add a task without task name
  fireEvent.change(inputDate, { target: { value: '05/30/2024' } });
  fireEvent.click(addButton);

  // Ensure the task is not added
  const taskElement = screen.queryByText(/05\/30\/2024/i); // Assuming date appears as text
  expect(taskElement).toBeNull();

 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);

  const inputElement = screen.getByLabelText(/Add New Item/i);
  const buttonElement = screen.getByTestId('new-item-button');

  fireEvent.change(inputElement, { target: { value: 'Math Test' } });
  fireEvent.click(buttonElement);

  const taskElement = screen.queryByText(/Math Test/i);
  expect(taskElement).toBeNull();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);

  const inputElement = screen.getByLabelText(/Add New Item/i);
  const dateElement = screen.getByLabelText(/Due Date/i);
  const buttonElement = screen.getByTestId('new-item-button');

  fireEvent.change(inputElement, { target: { value: 'Science Test' } });
  fireEvent.change(dateElement, { target: { value: '06/15/2024' } });
  fireEvent.click(buttonElement);

  const checkbox = screen.getByRole('checkbox', { value: 'Science Test' });
  fireEvent.click(checkbox);

  const taskElement = screen.queryByText(/Science Test/i);
  expect(taskElement).toBeNull();

 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);

  const inputElement = screen.getByLabelText(/Add New Item/i);
  const dateElement = screen.getByLabelText(/Due Date/i);
  const buttonElement = screen.getByTestId('new-item-button');

  fireEvent.change(inputElement, { target: { value: 'History Test' } });
  fireEvent.change(dateElement, { target: { value: '05/30/2024' } });
  fireEvent.click(buttonElement);

  const taskElement = screen.getByTestId('History Test');
  const backgroundColor = window.getComputedStyle(taskElement).backgroundColor;
  expect(backgroundColor).toContain('rgb(255, 204, 204)'); // Assuming `#ffcccc` is converted to `rgb(255, 204, 204)`

 });
