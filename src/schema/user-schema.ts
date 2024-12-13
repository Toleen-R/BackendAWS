import Joi from "joi"; // Importerar Joi-biblioteket för validering av data

// Definierar ett schema för användarvalidering med hjälp av Joi
const userSchema = Joi.object({
  name: Joi.string()
    .min(5) // Namnet måste vara minst 5 tecken långt
    .max(30) // Namnet får vara högst 30 tecken långt
    .required(), // Namn är obligatoriskt

  email: Joi.string()
    .email() // E-postadressen måste vara i ett giltigt e-postformat
    .required(), // E-postadress är obligatoriskt

  password: Joi.string()
    .alphanum() // Lösenordet får endast innehålla alfanumeriska tecken
    .min(5) // Lösenordet måste vara minst 5 tecken långt
    .max(30) // Lösenordet får vara högst 30 tecken långt
    .required() // Lösenord är obligatoriskt
});

// Exporterar schemat så att det kan användas i andra delar av applikationen
export { userSchema };
