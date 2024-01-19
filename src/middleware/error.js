const errorHandler=async(err, req , res ,next)=>{
   console.error(err.stack)

  // Handle Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validationnn error', details: err.errors });
  }

  // Handle Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    console.log('hello')
    return res.status(400).json({ error: 'Unique constrainttt violation', details: err.errors });
  }

  // Handle SyntaxError (e.g., invalid JSON)
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invaliddd JSON' });
  }

  // Handle TypeError
  if (err instanceof TypeError) {
    return res.status(400).json({ error: 'Typeee error' });
  }

  // Handle ReferenceError
  if (err instanceof ReferenceError) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Handle other types of errors or respond with a generic message
  res.status(500).json({ error: 'Internal Server Error' });

}

module.exports=errorHandler;