const _ = require("lodash");
const pino = require("pino");
const expressPino = require("express-pino-logger");

const mapValuesDeep = (v, callback) =>
  _.isObject(v) ? _.mapValues(v, v => mapValuesDeep(v, callback)) : callback(v);

const initialConfig = {
  name: "platform-updater",
  prettyPrint: process.env.LOG_PRETTY || false,
  level: process.env.LOG_LEVEL || "debug",
  serializers: {
    [Symbol.for("pino.*")]: obj => {
      const result = mapValuesDeep(obj, value => {
        return _.isArray(value) ? { ...value } : value;
      });

      return result;
    }
  }
};

const createLogger = config => pino({ ...initialConfig, ...config });
const createExpressLogger = logger => expressPino(logger);

module.exports = {
  createLogger,
  createExpressLogger
};
