class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string} code - stable machine-readable error code
   * @param {object} [details]
   */
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = { AppError };

