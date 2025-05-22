import {Router} from 'express';
import containerRoutes from './containers';

/*
import { AdminController } from '@/controllers/admin';
*/

import {AuthService} from '@/services/auth';
import {UserRepository} from '@/repositories/user-repository';
import userRoutes from "@/routes/user.routes";
import {authService} from "@/services";
import router from "@/routes/image-route";
import imageRoute from "@/routes/image-route";
import {ImageListRepository} from "@/repositories/Image-list-repository";
import {ApiResponseFormatter, ImageListController, QueryParameterParser} from "@/controllers/image-list.controller";

const appRouter = Router();

const userRepository = new UserRepository();
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const imageListRepo = new ImageListRepository();
const responseFormatter = new ApiResponseFormatter();
const queryParser = new QueryParameterParser();

const imageListController = new ImageListController(
    imageListRepo,
    responseFormatter,
    queryParser
);

/*
const adminController = new AdminController(userRepository);
*/


appRouter.use('/containers', containerRoutes);
appRouter.use('/api', userRoutes);
appRouter.use('/api', imageRoute);
appRouter.use('/api/images', imageListController.getListImages);

export default appRouter;