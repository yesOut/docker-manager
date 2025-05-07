import { Router } from 'express';
import Docker from 'dockerode';
import { ImagesController } from '@/controllers/images';
import { DockerImageRepository } from '@/repositories/DockerImageRepository';

const router = Router();
const docker = new Docker();
const imageRepo = new DockerImageRepository(docker);
const imagesCtrl = new ImagesController(imageRepo);

router.post('/pull', imagesCtrl.pull.bind(imagesCtrl));

export default router;