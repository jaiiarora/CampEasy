class ExpressError extends Error{
    constructor(message, statusCode)
    {
        //calling error constructor
        super();
        this.message=message;
        this.statusCode=statusCode;
    }

}
module.exports=ExpressError;