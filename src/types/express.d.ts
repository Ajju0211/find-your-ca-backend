import { UserDocument } from 'src/Api/user/schema/user.schema';
import { CaDocument } from 'src/Api/ca/schema/ca.schema';

declare module 'express' {
  interface Request {
    user?: UserDocument | CaDocument;
    userPayload?: any;
  }
}
