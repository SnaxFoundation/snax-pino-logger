const _ = require("lodash");
const pino = require("pino");
const expressPino = require("express-pino-logger");

const mapValuesDeep = (v, callback) =>
  _.isObject(v) ? _.mapValues(v, v => mapValuesDeep(v, callback)) : callback(v);

const initialConfig = {
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
