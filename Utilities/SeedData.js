import { TransactionModel } from "../models/TransactionModel.js";

export const seedData=async(res)=>{
    try {
      const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
      const data = await response.json()
      await TransactionModel.deleteMany()
      const dataSeeded = await Promise.all(data.map(async (e) => {
          const date = new Date(e.dateOfSale)
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        e["month"] =monthNames[date.getMonth()]
        e["price"]= e.price.toString()
        const transaction = new TransactionModel(e)
        await transaction.save()
        return transaction
    }));

    if(dataSeeded){
        res.status(201).send({ message: "Database initialized successfully"});
    }
    } catch (error) {
      console.error(error);
      res.status(500).send({error:"Internal Server Error" });
    }
}
