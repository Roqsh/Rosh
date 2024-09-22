

/**
 * Implements a FIFO (First In, First Out) cache.
 * Once the capacity is reached, the oldest element (first added) will be evicted.
 */
export class EvictingList {

    /**
     * Creates an instance of EvictingList.
     * @param {number} capacity - The maximum number of elements the list can hold.
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.queue = []; // Array to keep track of the order of elements
        this.map = new Map(); // Map to store the key-value pairs
    }

    /**
     * Adds a new key-value pair to the list.
     * If the list exceeds the capacity, the oldest item is evicted.
     * If the key already exists, it will be overwritten.
     * @param {string} key - The key of the element to add.
     * @param {*} value - The value of the element to add.
     */
    add(key, value) {
        // If the key already exists, remove it from the queue and map
        if (this.map.has(key)) {
            this.queue = this.queue.filter(item => item !== key);
        }
        // If at capacity, evict the oldest item (first in the queue)
        if (this.queue.length === this.capacity) {
            const oldestKey = this.queue.shift(); // Remove the oldest item from the queue
            this.map.delete(oldestKey); // Remove the oldest item from the map
        }
        // Add the new key-value pair
        this.queue.push(key); // Add the key to the end of the queue
        this.map.set(key, value); // Store the key-value pair in the map
    }

    /**
     * Retrieves the value associated with the given key.
     * @param {string} key - The key of the element to retrieve.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    get(key) {
        return this.map.has(key) ? this.map.get(key) : null;
    }

    /**
     * Retrieves all key-value pairs currently stored in the list.
     * @returns {Array<{key: string, value: *}>} An array of objects containing all stored key-value pairs.
     */
    getAll() {
        return this.queue.map(key => ({ key, value: this.map.get(key) }));
    }

    /**
     * Removes the key-value pair associated with the given key.
     * @param {string} key - The key of the element to remove.
     * @returns {boolean} True if the key was removed, false if the key does not exist.
     */
    remove(key) {
        if (!this.map.has(key)) return false;
        this.queue = this.queue.filter(item => item !== key); // Remove the key from the queue
        this.map.delete(key); // Remove the key-value pair from the map
        return true;
    }

    /**
     * Gets the current size of the evicting list.
     * @returns {number} The number of elements currently in the list.
     */
    getCurrentSize() {
        return this.map.size;
    }

    /**
     * Gets the maximum capacity of the evicting list.
     * @returns {number} The maximum number of elements the list can hold.
     */
    getMaxSize() {
        return this.capacity;
    }

    /**
     * Checks if the evicting list has no stored data.
     * @returns {boolean} True if the list is empty, false otherwise.
     */
    isEmpty() {
        return this.getCurrentSize() === 0;
    }

    /**
     * Checks if the evicting list is at its maximum capacity.
     * @returns {boolean} True if the list is at its maximum capacity, false otherwise.
     */ 
    isFull() {
        return this.getCurrentSize() === this.getMaxSize();
    }

    /**
     * Checks if the evicting list contains a specific key.
     * @param {string} key - The key to check for.
     * @returns {boolean} True if the list contains the key, false otherwise.
     */
    containsKey(key) {
        return this.map.has(key);
    }

    /**
     * Clears all elements from the evicting list.
     */
    clear() {
        this.queue = [];
        this.map.clear();
    }
}