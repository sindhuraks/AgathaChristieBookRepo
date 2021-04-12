const express = require('express');
const {Book , validate} = require('../models/book');
const route = express.Router();

const err404Msg = 'Book not found..';

//* search for all books
route.get('/' , async(req , res) => {

    //? get all details for all books
    const book = await Book.find({},{_id :0, __v:0}).sort('name');
    res.send(book);

});

//* search a book by entering partial or full name
route.get('/:name' , async(req , res) => {

    let partialToMatch= new RegExp(req.params.name,'i'); 
    //? get all details for the entered book name
    const book = await Book.find({name : partialToMatch },{_id :0, __v:0});
    res.send(book);

});

//* Add a book to the database
route.post('/' , async(req , res) => {


    try {
        let book = new Book(

            {
                isbn : req.body.isbn,
                name : req.body.name,
                price : req.body.price,
                yearOfPublication : req.body.yearOfPublication,
                rating : req.body.rating,
                format : req.body.format
            }
        );
        //? validation of the book details
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
    //? save details to the database
    book = await book.save();
    res.send(book);
    }catch(ex) {console.log(ex.message);}

});

//* update the price of a book based on
//* partial / entire name and format of book 
route.put('/:name/:format' , async(req , res) => {

    const modifyMsg = 'Book modified successfully..';
    const notModifyMsg = 'No book modified..';

        try{
        
            let bookName = req.params.name;
            let partialToMatch= new RegExp(bookName,'i'); 
            let bookFormat = req.params.format;
            let partialFormat= new RegExp(bookFormat,'i'); 
            let updatePrice = req.body.price;

            //? update the database
            const book = await Book.where({ name: partialToMatch },{format:partialFormat})
                                    .updateOne({ $set: { price: updatePrice }});

            //? validate the entered price
            const {error} = validate(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            }

        //* update the price if the document is present
        if(book.n === 1 && book.nModified === 1) {
            res.status(200).send(modifyMsg);
        }
        //* do not update if the price is same as in the document
        if(book.n === 1 && book.nModified === 0) {
            res.status(200).send(notModifyMsg);
        }
        //* book not found if name and format not available in the database
        if(book.n === 0 && book.nModified === 0) {
            res.status(404).send(err404Msg);
        }
    }catch(ex) {
                    console.log(ex.message);
                }
});

//* delete a book based on name
route.delete('/:name' , async(req , res) => {

    const delMsg = 'Book deleted successfully..';
    let bookName = req.params.name;
    let partialToMatch= new RegExp(bookName,'i'); 

    //? delete the book from the database
    const book = await Book.where({ name: partialToMatch })
                            .deleteOne({ name: partialToMatch });

    //* book deleted if present in the database
    if(book.deletedCount === 1) {
        res.status(200).send(delMsg);
    }
    //* book not found if not present in the database
    else {
        res.status(404).send(err404Msg);
    }

});

module.exports = route;


