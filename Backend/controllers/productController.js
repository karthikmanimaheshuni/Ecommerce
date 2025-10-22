import {v2 as cloudinary} from "cloudinary"
//import { CloudinaryStorage } from "multer-storage-cloudinary";
import productModel from "../models/productModel.js";


{/** function for add product */}

export const addProduct = async(req,res)=>{

    try {
        
        const {name,description,category,price,inventory,subCategory,sizes,bestseller} = req.body;

        const image1 =req.files.image1 && req.files.image1[0];
        const image2 =req.files.image2 && req.files.image2[0];
        const image3 =req.files.image3 && req.files.image3[0];
        const image4 =req.files.image4 && req.files.image4[0];

        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined);

        const imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price:Number(price),
            inventory:Number(inventory),
            image:imagesUrl,
            category,
            subCategory,
            sizes : JSON.parse(sizes),//we cannot send he array directly as form data 
            bestseller : bestseller==='true' ? true : false,
            date: Date.now()

        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({success:true , message: "product added "})


    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        res.json({success:false,message:error.message});
        
        
    }


}

{/** funtion for list products */}
export const listProducts = async(req,res)=>{

    try {
        
        const product = await productModel.find({});
        res.json({success:true , product})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
        
    }

}

{/** funtion for removing a product */}
export const removeProducts = async(req,res)=>{
    try {

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true , message:"product removed "});

    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message});
        
    }
}

{/** function for single product info  */}
export const singleProductInfo = async(req,res)=>{

    try {
        
        const {productId } =req.body;
        const product = await productModel.findById(productId);
        res.json({success:true,product});

    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message});
        
    }
    
}


export const updateInventory = async (req, res) => {
    try {
        const { id, change } = req.body; // change can be +1 or -1
        const product = await productModel.findByIdAndUpdate(id, { $inc: { inventory: change } }, { new: true });
        if (!product) return res.json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Inventory updated", product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
