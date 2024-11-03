import React, { useEffect, useState } from "react";
import { runTests } from "./runTests";

/**
 * Generates random data based on a given JSON Schema.
 * @param {object} schema - The JSON Schema defining the structure and constraints of the data.
 * @returns {any} - Randomly generated data that conforms to the schema.
 * @throws {Error} - Throws an error if the provided schema is invalid.
 */
export function generateDataFromSchema(schema: any): any {
  if (!schema || typeof schema !== "object") {
    throw new Error("Invalid schema provided");
  }

  switch (schema.type) {
    case "integer":
      return getRandomInt(schema.minimum || 0, schema.maximum || 100);
    case "number":
      return getRandomFloat(schema.minimum || 0, schema.maximum || 100);
    case "string":
      if (schema.enum) {
        return schema.enum[Math.floor(Math.random() * schema.enum.length)];
      }
      return generateRandomString(
        schema.minLength || 3,
        schema.maxLength || 10
      );
    case "boolean":
      return Math.random() < 0.5;
    case "array":
      const length = getRandomInt(schema.minItems || 0, schema.maxItems || 5);
      if (schema.uniqueItems) {
        const uniqueItems = new Set();
        while (uniqueItems.size < length) {
          uniqueItems.add(generateDataFromSchema(schema.items));
        }
        return Array.from(uniqueItems);
      }
      return Array.from({ length }, () => generateDataFromSchema(schema.items));
    case "object":
      const obj: any = {};
      const requiredProps = schema.required || [];
      Object.entries(schema.properties).forEach(([key, propSchema]) => {
        if (requiredProps.includes(key) || key === "preferences") {
          obj[key] = generateDataFromSchema(propSchema);
        } else if (Math.random() < 0.5) {
          obj[key] = generateDataFromSchema(propSchema);
        }
      });
      return obj;
    default:
      return null;
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomString(minLength: number, maxLength: number): string {
  const length = getRandomInt(minLength, maxLength);
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(getRandomInt(0, characters.length - 1))
  ).join("");
}

const RandomDataGenerator: React.FC = () => {
  const [testResults, setTestResults] = useState<
    Array<{ name: string; result: boolean }>
  >([]);
  const [randomArray, setRandomArray] = useState<any[]>([]);
  const [randomData, setRandomData] = useState<any>(null);

  useEffect(() => {
    const results = runTests();
    setTestResults(results);

    console.log("\nRunning Random-Based Tests:");
    results.forEach((test) => {
      console.log(`${test.name}: ${test.result ? "PASS" : "FAIL"}`);
    });

    const schema = {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1, maximum: 1000 },
        name: { type: "string", minLength: 3, maxLength: 10 },
        email: { type: "string", minLength: 5, maxLength: 20 },
        isActive: { type: "boolean" },
        age: { type: "integer", minimum: 18, maximum: 99 },
        preferences: {
          type: "object",
          properties: {
            notifications: { type: "boolean" },
            theme: { type: "string", minLength: 3, maxLength: 10 },
          },
        },
      },
      required: ["id", "name", "isActive"],
    };
    const generatedData = generateDataFromSchema(schema);
    setRandomData(generatedData);

    console.log("\nRandom Generated Data:");
    console.log(JSON.stringify(generatedData, null, 2));

    const arraySchema = {
      type: "array",
      items: { type: "integer", minimum: 1, maximum: 10 },
      minItems: 5,
      maxItems: 5,
      uniqueItems: true,
    };
    const generatedArray = generateDataFromSchema(arraySchema);
    setRandomArray(generatedArray);

    console.log("\nRandom Generated Array:");
    console.log(JSON.stringify(generatedArray, null, 2));
  }, []);

  return (
    <div>
      <h5>Test Results:</h5>
      <ul>
        {testResults.map((test, index) => (
          <li key={index} style={{ color: test.result ? "green" : "red" }}>
            {test.name}: {test.result ? "PASS" : "FAIL"}
          </li>
        ))}
      </ul>

      <h5>Random Generated Data:</h5>
      <pre>{JSON.stringify(randomData, null, 2)}</pre>

      <h5>Random Generated Array:</h5>
      <pre>{JSON.stringify(randomArray, null, 2)}</pre>
    </div>
  );
};

export default RandomDataGenerator;
