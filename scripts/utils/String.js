

/**
 * A utility class for common string manipulations.
 */
export class String {

    /**
     * Capitalizes the **first** letter of the given string.
     * @param {string} string - The string to modify
     * @returns {string} The updated string with the first letter capitalized
     * @example String.toUpperCase('hello'); // returns 'Hello'
     * @remarks Gives back the original input if it is not a string/or length = 0
     */
    static toUpperCase(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }

        const [first, ...rest] = string;
        return `${first.toUpperCase()}${rest.join('')}`;
    }

    /**
     * Lowercases the **first** letter of the given string.
     * @param {string} string - The string to modify
     * @returns {string} The updated string with the first letter lowercased
     * @example String.toLowerCase('Hello'); // returns 'hello'
     * @remarks Gives back the original input if it is not a string/or length = 0
     */
    static toLowerCase(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }

        const [first, ...rest] = string;
        return `${first.toLowerCase()}${rest.join('')}`;
    }

    /**
     * Converts a string to camelCase.
     * @param {string} string - The string to convert.
     * @returns {string} The camelCase version of the input string.
     * @example String.toCamelCase("hello world"); // returns "helloWorld"
     */
    static toCamelCase(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }

        return string
            .toLowerCase()
            .replace(/[-_ ]+(.)/g, (match, group1) => group1.toUpperCase());
    }

    /**
     * Converts a string to snake_case.
     * @param {string} string - The string to convert.
     * @returns {string} The snake_case version of the input string.
     * @example String.toSnakeCase("Hello World"); // returns "hello_world"
     */
    static toSnakeCase(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }

        return string
            .replace(/\s+/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();
    }

    /**
     * Reverses the given string.
     * @param {string} string - The string to reverse.
     * @returns {string} The reversed string.
     * @example String.reverse("hello"); // returns "olleh"
     */
    static reverse(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }

        return string.split('').reverse().join('');
    }

    /**
     * Truncates the given string to a specified length, adding "..." if it exceeds that length.
     * @param {string} string - The string to truncate.
     * @param {number} maxLength - The maximum length of the truncated string.
     * @returns {string} The truncated string with "..." added if it exceeds the length.
     * @example String.truncate("This is a long string", 10); // returns "This is a..."
     */
    static truncate(string, maxLength) {
        if (typeof string !== 'string' || string.length <= maxLength) {
            return string;
        }

        return `${string.slice(0, maxLength)}...`;
    }

    /**
     * Converts a camelCase string to a formatted string with a forward slash.
     * @param {string} string - The string to convert.
     * @returns {string} The converted string in "Example/A" format.
     * @example 
     * String.format("testB"); // returns "Test/B"
     */
    static format(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string;
        }
        
        return string
            // Insert '/' between lowercase and uppercase boundaries
            .replace(/([a-z])([A-Z])/g, (match, p1, p2) => `${p1}/${p2}`)
            // Capitalize the first character
            .replace(/^./, (match) => match.toUpperCase());
    }
}