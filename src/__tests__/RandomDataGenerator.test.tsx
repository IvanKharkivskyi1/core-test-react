import { render, screen } from '@testing-library/react';
import RandomDataGenerator from '../RandomDataGenerator';
import { generateDataFromSchema } from '../RandomDataGenerator';

describe('generateDataFromSchema', () => {
  it('should generate an integer within the specified range', () => {
    const schema = { type: 'integer', minimum: 10, maximum: 20 };
    const randomInteger = generateDataFromSchema(schema);
    expect(typeof randomInteger).toBe('number');
    expect(randomInteger).toBeGreaterThanOrEqual(10);
    expect(randomInteger).toBeLessThanOrEqual(20);
  });

  it('should generate a string of the correct length', () => {
    const schema = { type: 'string', minLength: 5, maxLength: 10 };
    const randomString = generateDataFromSchema(schema);
    expect(typeof randomString).toBe('string');
    expect(randomString.length).toBeGreaterThanOrEqual(5);
    expect(randomString.length).toBeLessThanOrEqual(10);
  });

  it('should generate a boolean value', () => {
    const schema = { type: 'boolean' };
    const randomBoolean = generateDataFromSchema(schema);
    expect(typeof randomBoolean).toBe('boolean');
  });

  it('should generate an object with required properties', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1, maximum: 100 },
        name: { type: 'string', minLength: 3, maxLength: 10 }
      },
      required: ['id', 'name']
    };
    const randomObject = generateDataFromSchema(schema);
    expect(randomObject).toHaveProperty('id');
    expect(randomObject).toHaveProperty('name');
  });
});

describe('RandomDataGenerator Component', () => {
  it('should render Random Data Generator without crashing', () => {
    render(<RandomDataGenerator />);
    const headingElement = screen.getByText(/Random Data Generator/i);
    expect(headingElement).toBeInTheDocument();
  });
});
