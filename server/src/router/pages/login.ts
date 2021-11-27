import {Request, Response, Router} from 'express';
import authenticate from '../../middleware/authenticate.middleware';
import TypedRequest from '../../types/TypedRequest';
import User from '../../models/types/user';

const router = Router();
router.get('/', [authenticate({skipRes: true})] ,async(req: TypedRequest<{user?: User}>, res: Response) => {
    //if member authorized -> redirect to panel with own product.
    //But this panel doesn't exist now.
    return req.user ?  res.redirect('/') : res.render('login');
})

export default router;