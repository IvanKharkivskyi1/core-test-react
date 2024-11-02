import { generateDataFromSchema } from './RandomDataGenerator';

/**
 * Runs a series of tests and returns the results as an array of objects.
 * @returns {Array<{ name: string, result: boolean }>} - An array of test result objects.
 */
export function runTests(): Array<{ name: string; result: boolean }> {
  const results: Array<{ name: string; result: boolean }> = [];

  try {
    const intSchema = { type: 'integer', minimum: 10, maximum: 20 };
    const randomInteger = generateDataFromSchema(intSchema);
    results.push({
      name: 'Integer generation test',
      result: typeof randomInteger === 'number' && randomInteger >= 10 && randomInteger <= 20
    });

    const stringSchema = { type: 'string', minLength: 5, maxLength: 10 };
    const randomString = generateDataFromSchema(stringSchema);
    results.push({
      name: 'String generation test',
      result: typeof randomString === 'string' && randomString.length >= 5 && randomString.length <= 10
    });

    const booleanSchema = { type: 'boolean' };
    const randomBoolean = generateDataFromSchema(booleanSchema);
    results.push({
      name: 'Boolean generation test',
      result: typeof randomBoolean === 'boolean'
    });

    const objectSchema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1, maximum: 100 },
        name: { type: 'string', minLength: 3, maxLength: 10 }
      },
      required: ['id', 'name']
    };
    const randomObject = generateDataFromSchema(objectSchema);
    results.push({
      name: 'Object generation test',
      result: randomObject.hasOwnProperty('id') && randomObject.hasOwnProperty('name')
    });
  } catch (error) {
    if (error instanceof Error) {
      results.push({
        name: `Error during tests: ${error.message}`,
        result: false
      });
    } else {
      results.push({
        name: 'Error during tests: An unknown error occurred',
        result: false
      });
    }
  }

  return results;
}
