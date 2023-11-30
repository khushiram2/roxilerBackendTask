import mongoose from "mongoose";



const TransactionSchema= new mongoose.Schema({
id:{type:Number,required:true,unique:true},
title:{type:String,required:true},
price:{type:Number,required:true},
description:{type:String,required:true},
category:{type:String,required:true},
image:{type:String,required:true},
sold:{type:Boolean,required:true},
dateOfSale:{type:Date,required:true},
month:{type:String,required:true}

})

export const TransactionModel=mongoose.model("Transaction",TransactionSchema)