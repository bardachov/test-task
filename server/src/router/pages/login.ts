import {Response, Router} from 'express';
import authenticate from '../../middleware/authenticate.middleware';
import TypedRequest from '../../types/TypedRequest';
import User from '../../models/types/user';

const router = Router();
router.get('/', [authenticate({skipRes: true})] ,async(req: TypedRequest<{user?: User}>, res: Response) => {
    return req.user ?  res.redirect('/account') : res.render('login');
})

export default router;