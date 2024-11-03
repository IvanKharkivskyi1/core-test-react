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
    expect(typeof randomObject.id).toBe('number');
    expect(randomObject.id).toBeGreaterThanOrEqual(1);
    expect(randomObject.id).toBeLessThanOrEqual(100);

    expect(randomObject).toHaveProperty('name');
    expect(typeof randomObject.name).toBe('string');
    expect(randomObject.name.length).toBeGreaterThanOrEqual(3);
    expect(randomObject.name.length).toBeLessThanOrEqual(10);
  });

  describe('Object schema with optional properties', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1, maximum: 1000 },
        email: { type: 'string', minLength: 5, maxLength: 20 },
        isActive: { type: 'boolean' },
        age: { type: 'integer', minimum: 18, maximum: 99 }
      },
      required: ['id']
    };
    const randomObject = generateDataFromSchema(schema);

    it('should always generate the required property "id"', () => {
      expect(randomObject).toHaveProperty('id');
      expect(typeof randomObject.id).toBe('number');
    });

    test.each([
      ['email', 'string', randomObject.email, (email: string | any[]) => {
        expect(typeof email).toBe('string');
        expect(email.length).toBeGreaterThanOrEqual(5);
        expect(email.length).toBeLessThanOrEqual(20);
      }],
      ['isActive', 'boolean', randomObject.isActive, isActive => {
        expect(typeof isActive).toBe('boolean');
      }],
      ['age', 'number', randomObject.age, age => {
        expect(typeof age).toBe('number');
        expect(age).toBeGreaterThanOrEqual(18);
        expect(age).toBeLessThanOrEqual(99);
      }]
    ])(
      'should generate "%s" of type "%s" and validate if present',
      (property, type, value, assertion) => {
        if (value !== undefined) {
          assertion(value);
        }
      }
    );
  });

  describe('Array schema tests', () => {
    it('should generate an array with a specified length and unique items', () => {
      const schema = {
        type: 'array',
        items: { type: 'integer', minimum: 1, maximum: 10 },
        minItems: 5,
        maxItems: 5,
        uniqueItems: true
      };
      const randomArray = generateDataFromSchema(schema);
      expect(Array.isArray(randomArray)).toBe(true);
      expect(randomArray.length).toBe(5);
      expect(new Set(randomArray).size).toBe(randomArray.length);
    });

    it('should generate an array with possible empty values', () => {
      const schema = {
        type: 'array',
        items: { type: 'integer' },
        minItems: 0,
        maxItems: 5
      };
      const randomArray = generateDataFromSchema(schema);
      expect(Array.isArray(randomArray)).toBe(true);
      expect(randomArray.length).toBeGreaterThanOrEqual(0);
      expect(randomArray.length).toBeLessThanOrEqual(5);
    });

    it('should generate an array with objects having specific properties', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'integer', minimum: 1, maximum: 100 }
          },
          required: ['value']
        },
        minItems: 1,
        maxItems: 3
      };
      const randomArray = generateDataFromSchema(schema);
      expect(Array.isArray(randomArray)).toBe(true);
      randomArray.forEach((item: { value: any; }) => {
        expect(item).toHaveProperty('value');
        expect(typeof item.value).toBe('number');
        expect(item.value).toBeGreaterThanOrEqual(1);
        expect(item.value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Nested objects with mixed types', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1, maximum: 100 },
        preferences: {
          type: 'object',
          properties: {
            notifications: { type: 'boolean' },
            theme: { type: 'string', minLength: 3, maxLength: 10 }
          }
        }
      },
      required: ['id']
    };
    const randomObject = generateDataFromSchema(schema);

    it('should generate the required "id" property', () => {
      expect(randomObject).toHaveProperty('id');
      expect(typeof randomObject.id).toBe('number');
    });

    it('should generate "preferences" as an object and validate nested properties', () => {
      // Assert that `preferences` is either `undefined` or an object
      expect(
        randomObject.preferences === undefined || typeof randomObject.preferences === 'object'
      ).toBe(true);
    
      // Proceed with validation checks, assuming `preferences` is defined
      const notificationsType = randomObject.preferences?.notifications;
      const theme = randomObject.preferences?.theme;
    
      // Validate `notifications` type if it exists
      expect(
        notificationsType === undefined || typeof notificationsType === 'boolean'
      ).toBe(true);
    
      // Validate `theme` type and length if it exists
      expect(
        theme === undefined || 
        (typeof theme === 'string' && theme.length >= 3 && theme.length <= 10)
      ).toBe(true);
    });    
  });
});

describe('RandomDataGenerator Component', () => {
  it('should render Random Data Generator without crashing', () => {
    render(<RandomDataGenerator />);
    const headingElement = screen.queryByText(/Test Results:/i);
    expect(headingElement).toBeInTheDocument();
  });
});
