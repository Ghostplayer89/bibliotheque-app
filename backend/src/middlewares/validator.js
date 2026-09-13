// src/middlewares/validator.js

// ======================================================
// Middleware : vérifie que les champs requis sont présents
// Usage : router.post('/', validateFields(['nom', 'nationalite']), controller)
// ======================================================
const validateFields = (fields) => {
    return (req, res, next) => {
        const missingFields = [];
        
        fields.forEach(field => {
            if (!req.body[field] || req.body[field].toString().trim() === '') {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            const error = new Error(
                `Champs obligatoires manquants : ${missingFields.join(', ')}`
            );
            error.statusCode = 400;
            return next(error);
        }
        
        next();
    };
};

module.exports = { validateFields };