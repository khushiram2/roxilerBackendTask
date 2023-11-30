import { TransactionModel } from "../models/TransactionModel.js";

export const getAllTransactions = async (req, res) => {
    const { month = "", title="",price="",description="", page = 1, perPage = 10 } = req.query;
    const priceFilter = price && !isNaN(parseInt(price)) ? parseInt(price) : undefined;
    try {
        const pageNumber = parseInt(page);
        const perPageNumber = parseInt(perPage);
          if(month.length===0){
            const allTransaction = await TransactionModel.find({})
            .sort({ id: 1 })
            .skip((pageNumber - 1) * perPageNumber)
            .limit(perPageNumber);
            res.status(200).send({ message: "success", data: allTransaction });
        }else{
            const allTransaction = await TransactionModel.find({ month: month ,
                $or: [
                    { title: { $regex: new RegExp(title, 'i') } },
                    { description: { $regex: new RegExp(description, 'i') } },
                    { price: priceFilter}
                ],
            })
            .skip((pageNumber - 1) * perPageNumber)
            .limit(perPageNumber);
            res.status(200).send({ message: "success", data: allTransaction });
        }  

       
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "failed" });
    }
};




  export  const getStatsForMonth =async (req,res) => {

        try {
            const { month } = req.query;
            const totalSaleAmount = await TransactionModel.aggregate([
                {
                    $match: {
                        month:month,
                        sold:true
                    },
                },
                {$group: { _id: null, totalAmount: { $sum: '$price' } }},
            ]);
            const totalSoldItems = await TransactionModel.countDocuments({
                month:month,
                sold:true
            });
            
            const totalNotSoldItems = await TransactionModel.countDocuments({
                month:month,
                sold: false,
            });
            
            res.send({
                totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
                totalSoldItems,
                totalNotSoldItems,
            });
        } catch (error) {
            console.error('error occured while fetching statistics:', error);
            res.status(500).json({ error: 'server error' });
        }
    }

    export const getBarChartData = async (req, res) => {
        const { month = "January" } = req.query;
    
        try {
            const barChartData = await TransactionModel.aggregate([
                {
                    $match: { month: month }
                },
                {
                    $group: {
                        _id: null,
                        "0-100": { $sum: { $cond: [{ $lte: ['$price', 100] }, 1, 0] } },
                        "101-200": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 100] }, { $lte: ['$price', 200] }] }, 1, 0] } },
                        "201-300": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 200] }, { $lte: ['$price', 300] }] }, 1, 0] } },
                        "301-400": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 300] }, { $lte: ['$price', 400] }] }, 1, 0] } },
                        "401-500": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 400] }, { $lte: ['$price', 500] }] }, 1, 0] } },
                        "501-600": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 500] }, { $lte: ['$price', 600] }] }, 1, 0] } },
                        "601-700": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 600] }, { $lte: ['$price', 700] }] }, 1, 0] } },
                        "701-800": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 700] }, { $lte: ['$price', 800] }] }, 1, 0] } },
                        "801-900": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 800] }, { $lte: ['$price', 900] }] }, 1, 0] } },
                        "901above": { $sum: { $cond: [{ $gt: ['$price', 900] }, 1, 0] } },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        "0-100": 1,
                        "101-200": 1,
                        "201-300": 1,
                        "301-400": 1,
                        "401-500": 1,
                        "501-600": 1,
                        "601-700": 1,
                        "701-800": 1,
                        "801-900": 1,
                        "901above": 1
                    }
                }
            ]);
    
            res.status(200).send({ message: "success", data: barChartData[0] });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "failed" });
        }
    };

export const getPieData =async (req,res) => { 
    try {
        const {month="January"}=req.query
        const pieChartData = await TransactionModel.aggregate([
          {
            $match: { month: month }
          },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              category: '$_id',
              count: 1,
              _id: 0
            }
          }
        ]);
    
        res.status(200).json({ message: 'success', data: pieChartData });
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'failed' });
      }
 }

 export const alldataTogether=async(req,res)=>{
    try {
        const {month="January"}=req.query
        const totalSaleAmount = await TransactionModel.aggregate([
            {
                $match: {
                    month:month,
                    sold:true
                },
            },
            {$group: { _id: null, totalAmount: { $sum: '$price' } }},
        ]);
        const totalSoldItems = await TransactionModel.countDocuments({
            month:month,
            sold:true
        });
        
        const totalNotSoldItems = await TransactionModel.countDocuments({
            month:month,
            sold: false,
        });


        const barChartData = await TransactionModel.aggregate([
            {
                $match: { month: month }
            },
            {
                $group: {
                    _id: null,
                    "0-100": { $sum: { $cond: [{ $lte: ['$price', 100] }, 1, 0] } },
                    "101-200": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 100] }, { $lte: ['$price', 200] }] }, 1, 0] } },
                    "201-300": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 200] }, { $lte: ['$price', 300] }] }, 1, 0] } },
                    "301-400": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 300] }, { $lte: ['$price', 400] }] }, 1, 0] } },
                    "401-500": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 400] }, { $lte: ['$price', 500] }] }, 1, 0] } },
                    "501-600": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 500] }, { $lte: ['$price', 600] }] }, 1, 0] } },
                    "601-700": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 600] }, { $lte: ['$price', 700] }] }, 1, 0] } },
                    "701-800": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 700] }, { $lte: ['$price', 800] }] }, 1, 0] } },
                    "801-900": { $sum: { $cond: [{ $and: [{ $gt: ['$price', 800] }, { $lte: ['$price', 900] }] }, 1, 0] } },
                    "901above": { $sum: { $cond: [{ $gt: ['$price', 900] }, 1, 0] } },
                }
            },
            {
                $project: {
                    _id: 0,
                    "0-100": 1,
                    "101-200": 1,
                    "201-300": 1,
                    "301-400": 1,
                    "401-500": 1,
                    "501-600": 1,
                    "601-700": 1,
                    "701-800": 1,
                    "801-900": 1,
                    "901above": 1
                }
            }
        ]);

        const pieChartData = await TransactionModel.aggregate([
            {
              $match: { month: month }
            },
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                category: '$_id',
                count: 1,
                _id: 0
              }
            }
          ]);

          const response={
            statsData:{
                totalSaleAmount:totalSaleAmount,
                totalSoldItems:totalSoldItems,
                totalNotSoldItems:totalNotSoldItems
            },
            barChartData:barChartData,
            pieChartData:pieChartData
          }
          res.status(200).send({ message: "success", response });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'failed' });
    }
 }
 
    