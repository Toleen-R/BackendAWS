import Joi from "joi";
const userSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().alphanum().min(5).max(30).required()
});
export { userSchema };
