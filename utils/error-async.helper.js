module.exports = async (res, next, message, statusCode, data) => {
    await new Promise((resolved, rejected) => {
      try{
        const error = {
          statusCode,
          message,
          data
        };
        throw error;
      } catch(err){
        next(err);
      };
    }).catch(error => {
      next(error);
    });
  }
