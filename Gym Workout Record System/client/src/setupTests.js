import '@testing-library/jest-dom';

// Preserve original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Suppress specific warnings and errors in the test output
console.warn = (message, ...args) => {
  if (
    message.includes('deprecated') ||
    message.includes('ExperimentalWarning') ||
    message.includes('React Router Future Flag Warning') ||
    message.includes('Relative route resolution within Splat routes')
  ) {
    return; // Suppress these warnings
  }
  originalWarn(message, ...args); // Pass through other warnings
};

console.error = (message, ...args) => {
  if (typeof message === 'string' && message.includes('DEP')) {
    return; // Suppress deprecation warnings
  }
  // Log all other errors for visibility during testing
  originalError(message, ...args);
};

// Mock fetch globally
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
});

// Log to verify setup
console.log('setupTests.js is loaded');

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockClear();
});

// Mock WebSocket globally
global.WebSocket = class {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = global.WebSocket.CONNECTING; // Initial state: connecting
    console.log("Mock WebSocket initialized with ReadyState:", this.readyState);
    this.send = jest.fn();
    this.close = jest.fn();
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
  }

  triggerEvent(event, data) {
    console.log(`Triggering WebSocket '${event}' event.`);
  
    if (event === 'open') {
      console.log("Before setting readyState to OPEN:", this.readyState);
      this.readyState = this.constructor.OPEN; // Use `this.constructor.OPEN`
      console.log("After setting readyState to OPEN:", this.readyState);
  
      if (this.onopen) {
        console.log("Calling onopen callback with data:", data);
        this.onopen(data);
      } else {
        console.log("No onopen callback defined.");
      }
    } else if (event === 'close') {
      console.log("Before setting readyState to CLOSED:", this.readyState);
      this.readyState = this.constructor.CLOSED; // Use `this.constructor.CLOSED`
      console.log("After setting readyState to CLOSED:", this.readyState);
  
      if (this.onclose) {
        console.log("Calling onclose callback with data:", data);
        this.onclose(data);
      } else {
        console.log("No onclose callback defined.");
      }
    } else if (event === 'message') {
      console.log("Triggering 'message' event with data:", data);
      if (this.onmessage) this.onmessage(data);
    }
  }
};
