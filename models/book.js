const Joi = require('joi');
const mongoose = require('mongoose');

//* define schema for collection - book
const Book = new mongoose.model('Book' , new mongoose.Schema({
    
    isbn : {
        type : Number,
        required : true,
    } ,
    name : {
        type : String,
        required : true,
    } ,
    price : {
        type : Number,
        required : true
    } ,
    yearOfPublication : {
        type : String ,
    } ,
    rating : {
        type : Number,
        required : true
    } ,
    format : {
        type : String,
        enum : ['Paperback' , 'Hardcover']
    }

}));

//* validation of book details
function validateBook(book) {
    const schema = Joi.object({
        //* isbn should be positive
        isbn : Joi.number().integer().positive(), 

        //* name should have a min len = 3
        name : Joi.string().min(3),   

        //* price should be a positive integer            
        price : Joi.number().integer().positive().required(), 

        //* year should have len = 4 and have digits 0-9 and begin with 1-9
        yearOfPublication : Joi.string().length(4).pattern(/^[1-9][0-9]+$/), 

        //* rating should be positve and range between 0-10
        rating : Joi.number().positive().min(0).max(10).precision(1),
        
        //* format with len = 9
        format : Joi.string().length(9)
    });
    
    const result = schema.validate(book);
    return result;
}

//* export schema and function for validation
exports.Book = Book;
exports.validate = validateBook;
