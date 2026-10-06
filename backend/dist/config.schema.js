"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationSchema = void 0;
const joi_1 = require("@hapi/joi");
exports.configValidationSchema = joi_1.default.object({
    STAGE: joi_1.default.string().required(),
    DB_HOST: joi_1.default.string().required(),
    DB_PORT: joi_1.default.number().default(5432).required(),
    DB_USERNAME: joi_1.default.string().required(),
    DB_PASSWORD: joi_1.default.string().required(),
    DB_DATABASE: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
    SMTP_URL: joi_1.default.string().required(),
    MAIL_FROM: joi_1.default.string().required(),
});
//# sourceMappingURL=config.schema.js.map