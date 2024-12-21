function wrapAsync(fuc){
    return function(req,res, next){
        fuc(req, res, next).catch(next);
    }
};
module.exports = wrapAsync;

// module.exports = (fn)=>{
//     return (req, res, next)=>{
//         fn(req, res, next).catch(next);
//     }
// }