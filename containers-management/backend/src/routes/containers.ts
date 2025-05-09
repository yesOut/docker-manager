import {Router} from 'express';
import {ContainerController} from '@/controllers/containers';

const router = Router();
const controller = new ContainerController();

router.get('/', controller.getContainers.bind(controller));

router.get('/:id/logs', controller.getLogs.bind(controller));
router.get('/:id/stats', controller.getContainerStats.bind(controller));

router.post('/:id/start', controller.startContainer.bind(controller));
router.post('/:id/stop', controller.stopContainer.bind(controller));
router.post('/:id/restart', controller.restartContainer.bind(controller));
router.delete('/:id', controller.deleteContainer.bind(controller));

export default router;