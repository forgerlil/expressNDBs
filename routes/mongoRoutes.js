import express from 'express';
import {getAllVillains, getVillainByName, createVillain, updateVillain, defeatVillain} from '../controllers/villainControllers.js'
const mongoRouter = express.Router();

mongoRouter.route('/').get(getAllVillains).post(createVillain);
// To spice things up a little, we can get multiple villains based on parts of the name!
mongoRouter.route('/:name').get(getVillainByName);
mongoRouter.route('/:id').put(updateVillain).delete(defeatVillain);

export default mongoRouter;
