import ajv from "./ajv.js";
import schemas from "../schemas/index.js";

const validators = {};

Object.keys(schemas).forEach(schemaName => {
    validators[schemaName] = ajv.compile(schemas[schemaName]);
});

export default validators;