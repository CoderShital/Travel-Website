const Joi = require("joi");

const Listings = require("./models/listings");
const review = require("./models/review");
module.exports.listSchema = Joi.object({
    List : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: {
           url: Joi.string().allow("", null)
        }
    }).required()

});

//Client side kelay but server side ni validation is crucial.
//Hoppscotch or Postman se direct api req send krun validation violet krta yet. kahi fields mg empty sodta yetat.
//jo input field madhe data yenar ee tyavr validation lavav lgel tevha ek ek field vrti validation apply hoil. 
//Therefore eth j 'list' ahe n lihilel te create.ejs madhe fields chya values evaluate krnya sathi use kel hot tyat sagla data hota listing cha anlela
//Here we say -- list tr asavich required means list tr form zalich pahije but also hya ek ek field pn Hya type chya asavya ani required asavyat.


// validateListing function apn yala middleware chya form madhe convert krnyasathi banvav lagt jenekrun he pratyek rout sathi aplyala use krta yeil.
// as a middleware apn mg pass krnar rout create krtanna. mg saglyanna apply krta yeil validation.

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        ratings:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),

    }).required()
});