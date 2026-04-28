  import { json } from '@remix-run/node';     
                                          
  const asyncHandler = (fn) => async (args) => {
    try {                                                                                                                              
      return await fn(args);                  
    } catch (err) {                                                                                                                    
      console.error('ERROR:', err);
      return json(                                                                                                                     
        {
          success: false,                                                                                                              
          message: err.message || 'Internal Server Error',
          errors: err.errors || [],           
        },                                
        { status: err.statusCode || 500 }
      );                                                                                                                               
    }                                     
  };                                                                                                                                   
                                                                                                                                       
  export { asyncHandler };
