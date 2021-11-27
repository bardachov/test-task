import {Request, Response, Router} from 'express';

const router = Router();
router.get('/', async(req: Request, res: Response) => {
    return res.render('login');
})

export default router;