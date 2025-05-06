import { Router } from 'express';
import { ContainerController } from '@/controllers/containers';
import {AuthMiddleware} from "@/middlewares/auth";
import {authService} from "@/services";

const router = Router();
const authMiddleware = new AuthMiddleware(authService);
const controller = new ContainerController();

router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorize,
    controller.getContainers.bind(controller));



router.get('/:id/logs',
    authMiddleware.authenticate,
    authMiddleware.authorize,
    controller.getLogs.bind(controller));

router.get('/:id/stats', controller.getContainerStats.bind(controller));

router.post('/:id/start', controller.startContainer.bind(controller));
router.post('/:id/stop', controller.stopContainer.bind(controller));
router.post('/:id/restart', controller.restartContainer.bind(controller));
router.delete('/:id', controller.deleteContainer.bind(controller));

export default router;