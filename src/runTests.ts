import { generateDataFromSchema } from './RandomDataGenerator';

/**
 * Runs a series of tests and returns the results as an array of objects.
 * @returns {Array<{ name: string, result: boolean }>} - An array of test result objects.
 */
export function runTests(): Array<{ name: string; result: boolean }> {
  const results: Array<{ name: string; result: boolean }> = [];

  try {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1, maximum: 1000 },
        name: { type: 'string', minLength: 3, maxLength: 10 },
        email: { type: 'string', minLength: 5, maxLength: 20 },
        isActive: { type: 'boolean' },
        age: { type: 'integer', minimum: 18, maximum: 99 },
        preferences: {
          type: 'object',
          properties: {
            notifications: { type: 'boolean' },
            theme: { type: 'string', minLength: 3, maxLength: 10 }
          }
        }
      },
      required: ['id', 'name', 'isActive']
    };
    const randomData = generateDataFromSchema(schema);

    // Check if the generated id is an integer and within the specified range
    results.push({ name: 'Check id is integer', result: Number.isInteger(randomData.id) });
    results.push({ name: 'Check id is within range', result: randomData.id >= 1 && randomData.id <= 1000 });

    // Ensure the name is a string and its length falls within the specified constraints
    results.push({ name: 'Check name is string', result: typeof randomData.name === 'string' });
    results.push({ name: 'Check name length', result: randomData.name.length >= 3 && randomData.name.length <= 10 });

    // Verify isActive is a boolean
    results.push({ name: 'Check isActive is boolean', result: typeof randomData.isActive === 'boolean' });

    // Check if age is an integer or undefined, and if defined, it is within the specified range
    results.push({
      name: 'Check age is integer or undefined',
      result: randomData.age === undefined || (Number.isInteger(randomData.age) && randomData.age >= 18 && randomData.age <= 99)
    });

    // Validate email is either a string or undefined
    results.push({
      name: 'Check email is string or undefined',
      result: randomData.email === undefined || typeof randomData.email === 'string'
    });

    // Ensure preferences is an object or undefined
    results.push({
      name: 'Check preferences is object or undefined',
      result: randomData.preferences === undefined || typeof randomData.preferences === 'object'
    });

    // Check if notifications in preferences is a boolean, if preferences exist
    results.push({
      name: 'Check notifications in preferences is boolean if preferences exist',
      result:
        randomData.preferences &&
        (typeof randomData.preferences.notifications === 'boolean' || randomData.preferences.notifications === undefined)
    });


    // Verify theme in preferences is a string or undefined, if preferences exist
    results.push({
      name: 'Check theme in preferences is string or undefined',
      result: randomData.preferences === undefined ||
        randomData.preferences.theme === undefined ||
        typeof randomData.preferences.theme === 'string'
    });

    // Test for an array schema with minItems = 0 to ensure an empty array is possible
    const emptyArraySchema = {
      type: 'array',
      items: { type: 'integer' },
      minItems: 0,
      maxItems: 5
    };
    const emptyArray = generateDataFromSchema(emptyArraySchema);
    results.push({
      name: 'Check empty array with minItems = 0',
      result: Array.isArray(emptyArray) && emptyArray.length >= 0 && emptyArray.length <= 5
    });

    const arraySchema = {
      type: 'array',
      items: { type: 'integer', minimum: 1, maximum: 10 },
      minItems: 5,
      maxItems: 5,
      uniqueItems: true
    };
    const randomArray = generateDataFromSchema(arraySchema);
    results.push({
      name: 'Check unique items in array',
      result: Array.isArray(randomArray) && new Set(randomArray).size === randomArray.length
    });
  } catch (error) {
    if (error instanceof Error) {
      results.push({ name: `Error during tests: ${error.message}`, result: false });
    } else {
      results.push({ name: 'Error during tests: An unknown error occurred', result: false });
    }
  }

  return results;
}
