const Products = require('../models/productModel')
const bodyparser = require('body-parser');

// Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['page', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl = {
    getProducts: async(req, res) =>{
        try {
            //  console.log(req.query);
            // const products = await Products.find()
            // res.json(products);
            const features = new APIfeatures(Products.find(), req.query)
            .filtering()
            .sorting()
            .paginating()

            const products = await features.query
            // console.log({result: products.length,features});
            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async(req, res) =>{
        try {
            const {product_id, title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            const product = await Products.findOne({product_id})
            if(product)
                return res.status(400).json({msg: "This product already exists."})

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })

            await newProduct.save()
            res.json({msg: "Created a product"})
            // let    files = req.files.images;
            // let    filename = files.name;
            // let    product_id = req.body.product_id;
            // const  title = req.body.title; 
            // const  price = req.body.price;
            // const  description = req.body.description;
            // const  content = req.body.content;
            // const  images  = filename;
            // const  category = req.body.category;
            //     files.mv('./client/public/images/'+filename,(errs, docc)=>{
            //             if(errs) return res.status(400).json({msg: "No image upload"})
            //     });

            //     if(!images) return res.status(400).json({msg: "No image upload"})

            //     const product = await Products.findOne({product_id});
            //     if(product)
            //         return res.status(400).json({msg: "This product already exists."});
            //     const newProduct = new Products({
            //         product_id, title: title.toLowerCase(), price, description, content, images, category
            //     })
            //     await newProduct.save()
            //  res.json({msg: "Created a product"})
                // res.json({files,newProduct})
                
            //  console.log(newProduct);
            // const {product_id, title, price, description, content, images, category} = req.body;
            // const product_id = req.body.product_id;
            // const title = req.body.title;
            // if(!images) return res.status(400).json({msg: "No image upload"})

            // const product = await Products.findOne({product_id})
            // if(product)
            //     return res.status(400).json({msg: "This product already exists."})

            // const newProduct = new Products({
            //     product_id, title: title.toLowerCase(), price, description, content, images, category
            // })

            // res.json(newProduct)

            // await newProduct.save()
            // res.json({msg: "Created a product"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async(req, res) =>{
        try {
            // await Products.findByIdAndDelete(req.params.id)
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req, res) =>{
        try {
            const {title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({msg: "Updated a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = productCtrl