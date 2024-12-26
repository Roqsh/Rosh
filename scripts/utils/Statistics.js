

/**
 * A collection of statistical functions for analyzing datasets.
 */
export class Statistics {

    /**
     * Calculates the average (mean) of an array of numbers.
     * @param {number[]} values - The array of numbers.
     * @returns {number} The mean of the array.
     */
    static getAverage(values) {
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    /**
     * Calculates the median of a dataset.
     * @param {number[]} data - The dataset to calculate the median from.
     * @returns {number} The median value.
     */
    static getMedian(data) {

        const sortedData = [...data].sort((a, b) => a - b);
        const midIndex = Math.floor(sortedData.length / 2);

        return sortedData.length % 2 === 0
            ? (sortedData[midIndex - 1] + sortedData[midIndex]) / 2
            : sortedData[midIndex];
    }

    /**
     * Calculates the standard deviation of a dataset, which is the square root of the variance.
     * @param {number[]} data - The dataset to calculate the standard deviation for.
     * @returns {number} The standard deviation value.
     */
    static getDeviation(data) {
        const variance = this.getVariance(data);
        return Math.sqrt(variance);
    }

    /**
     * Identifies outliers in a dataset using the Interquartile Range (IQR) method.
     * @param {number[]} data - The dataset to analyze.
     * @returns {{lowOutliers: number[], highOutliers: number[]}} An object containing the low and high outliers.
     */
    static getOutliers(data) {

        data.sort((a, b) => a - b);  // Sort the dataset

        const midIndex = Math.floor(data.length / 2);
        const firstQuartile = this.getMedian(data.slice(0, midIndex));
        const thirdQuartile = this.getMedian(data.slice(Math.ceil(data.length / 2)));

        const interquartileRange = thirdQuartile - firstQuartile;
        const lowerBound = firstQuartile - 1.5 * interquartileRange;
        const upperBound = thirdQuartile + 1.5 * interquartileRange;

        const lowOutliers = data.filter(value => value < lowerBound);
        const highOutliers = data.filter(value => value > upperBound);

        return { lowOutliers, highOutliers };
    }

    /**
     * Calculates the skewness of a dataset, a measure of the asymmetry of the distribution.
     * @param {number[]} data - The dataset to calculate skewness for.
     * @returns {number} The skewness value.
     */
    static getSkewness(data) {

        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const median = this.getMedian(data);
        const variance = this.getVariance(data);

        if (variance === 0) return 0;

        return (3 * (mean - median)) / Math.sqrt(variance);
    }

    /**
     * Calculates the variance of a dataset, a measure of the dispersion of the data from the mean.
     * @param {number[]} data - The dataset to calculate variance for.
     * @returns {number} The variance value.
     */
    static getVariance(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    }

    /**
     * Calculates the kurtosis of a dataset, a measure of the "tailedness" of the distribution.
     * @param {number[]} data - The dataset to calculate kurtosis for.
     * @returns {number} The kurtosis value.
     */
    static getKurtosis(data) {

        const sampleSize = data.length;
        if (sampleSize < 3) return 0;

        const mean = data.reduce((sum, val) => sum + val, 0) / sampleSize;
        const variance = this.getVariance(data);
        if (variance === 0) return 0;

        const fourthMoment = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / sampleSize;
        const kurtosis = fourthMoment / Math.pow(variance, 2);

        return kurtosis - 3; // Excess kurtosis (relative to normal distribution)
    }

    /**
     * Calculates the Pearson correlation coefficient between two datasets.
     * @param {number[]} x - The first dataset.
     * @param {number[]} y - The second dataset.
     * @returns {number} The Pearson correlation coefficient, or NaN if it cannot be computed.
     */
    static getCorrelation(x, y) {
        // Check for equal length and non-empty arrays
        if (x.length !== y.length || x.length === 0) {
            return NaN;
        }

        const n = x.length;
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXSquare = x.reduce((sum, val) => sum + val * val, 0);
        const sumYSquare = y.reduce((sum, val) => sum + val * val, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    /**
     * Calculates the Greatest Common Divisor (GCD) of two integers.
     * This function returns the absolute value of the GCD to ensure the result is non-negative.
     * @param {number} a - The first integer.
     * @param {number} b - The second integer.
     * @returns {number} - The absolute value of the GCD of the two integers.
     */
    static getAbsoluteGcd(a, b) {

        function gcd(x, y) {
            while (y !== 0) {
                let temp = y;
                y = x % y;
                x = temp;
            }
            return x;
        }

        return gcd(Math.abs(a), Math.abs(b));
    }

    /**
     * Simplifies a fraction represented by two integers.
     * @param {number} numerator - The numerator of the fraction.
     * @param {number} denominator - The denominator of the fraction.
     * @returns {{numerator: number, denominator: number}} - The simplified fraction.
     */
    static getSimplifiedFraction(numerator, denominator) {

        const gcd = this.getAbsoluteGcd(numerator, denominator);

        return {
            numerator: numerator / gcd,
            denominator: denominator / gcd
        };
    }

    /**
     * Compares two arrays to see if they are similar within a specified tolerance.
     * @param {number[]} arrayA - The first array to compare.
     * @param {number[]} arrayB - The second array to compare.
     * @param {number} tolerance - The allowable difference between corresponding elements in the arrays.
     * @returns {boolean} - True if the arrays are similar, false otherwise.
     */
    static areArraysSimilar(arrayA, arrayB, tolerance = 0.7) {

        if (arrayA.length !== arrayB.length) return false;

        for (let i = 0; i < arrayA.length; i++) {
            if (Math.abs(arrayA[i] - arrayB[i]) > tolerance) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if there are more than a specified number of consecutive duplicate values in an array
     * @param {number[]} array - The array of numbers to check.
     * @param {number} threshold - The maximum number of consecutive duplicates allowed.
     * @returns {number} The index where the threshold is met, or NaN if not met.
     */
    static checkConsecutiveDuplicates(array, threshold) {

        let duplicateCount = 0;

        for (let i = 1; i < array.length; i++) {
            // If the current element is equal to the previous one, increment the duplicate count
            if (array[i] === array[i - 1]) {
                duplicateCount++;
                if (duplicateCount >= threshold) {
                    // Return the index where duplicates start
                    return i - duplicateCount;
                }
            } else {
                duplicateCount = 0;
            }
        }

        return NaN;
    }

    /**
     * Checks if a given number is nearly an integer.
     * @param {number} value - The number to check.
     * @param {number} [tolerance=1e-7] - The maximum difference from the nearest integer.
     * @returns {boolean} True if the number is nearly an integer, false otherwise.
     */
    static isNearlyInteger(value, tolerance = 1e-7) {
        return Math.abs(value - Math.round(value)) < tolerance;
    }
}