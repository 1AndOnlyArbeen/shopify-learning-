  import { data } from 'react-router';
                                        
  const asyncHandler = (fn) => async (args) => {
    try {                                                                                                           
      return await fn(args);
    } catch (err) {
      // Responses thrown by frameworks (e.g., Shopify auth redirects) are NOT errors.
      // Let React Router handle them.                                                                              
      if (err instanceof Response) throw err;
                                                                                                                    
      console.error('ERROR:', err);
      return data(                                                                                                  
        {         
          success: false,
          message: err.message || 'Internal Server Error',
          errors: err.errors || [],
        },                                                                                                          
        { status: err.statusCode || 500 },
      );                                                                                                            
    }             
  };

  export { asyncHandler };
