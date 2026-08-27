import { Router } from 'express';
import {
  syncCrash,
  asyncCrash,
  undefinedProperty,
  jsonError,
  timeoutError,
  returnStatus
} from '../controllers/debug.controller.js';

const router = Router();

router.get('/crash', syncCrash);
router.get('/async-crash', asyncCrash);
router.get('/undefined', undefinedProperty);
router.get('/json', jsonError);
router.get('/timeout', timeoutError);
router.get('/status/:code', returnStatus);

export default router;
