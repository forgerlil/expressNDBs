import express from 'express';
import {getAllHeroes, getSingleHero, createHero, updateHero, retireHero} from '../controllers/heroControllers.js'
const sqlRouter = express.Router();

sqlRouter.route('/').get(getAllHeroes).post(createHero);
sqlRouter.route('/:id').get(getSingleHero).put(updateHero).delete(retireHero);

export default sqlRouter;
