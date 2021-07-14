import { Router } from 'express';
import * as controller from '../controller/conversation.js';

const router = Router();

router.post('/createConversation', controller.createConversation);


export default router;
