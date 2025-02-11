import Ajv, {_, KeywordCxt} from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();

ajv.addKeyword({
    keyword: 'notEmpty',
    schemaType: 'boolean',
    type: 'string',
    code: function(context) {
        const {data, schema} = context;
        if(schema) {
            context.fail(_`${data}.trim() === ''`);
        }
    },
    error: {
        message: 'value cannot be empty'
    }
});

addFormats(ajv);

export default ajv;