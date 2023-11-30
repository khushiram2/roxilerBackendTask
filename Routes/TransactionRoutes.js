import { Router } from "express";
import { alldataTogether, getAllTransactions, getBarChartData, getPieData, getStatsForMonth } from "../Controllers/TransactionController.js";


const router=Router()

router.get("/all",getAllTransactions)


router.get('/statistics', getStatsForMonth);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieData);
router.get('/three-data', alldataTogether);


export const TransactionRouter=router