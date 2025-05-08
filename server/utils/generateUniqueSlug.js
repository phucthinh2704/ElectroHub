const slugify = require("slugify");
const Product = require("../models/product");

const generateUniqueSlug = async (title) => {
   let slug = slugify(title);
   const randomString = Math.random().toString(36).substring(2,10);
   let uniqueSlug = `${slug}-${randomString}`;
   
   while (await Product.findOne({ slug: uniqueSlug })) {
      const newRandomString = Math.random().toString(36).substring(2,10);
      uniqueSlug = `${slug}-${newRandomString}`; 
   }
   
   return uniqueSlug;
};
module.exports = generateUniqueSlug;