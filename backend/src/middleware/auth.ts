import { admin } from "../firebase/index"

export const auth = async (req: any, res: any, next: any) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        if (token) {
            await admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    console.log(decodedToken);
                })
                .catch((err: any) => {
                    if (err.errorInfo.code === "auth/id-token-expired") {
                        next(res.status(403).send('TokenExpiredError'));
            
                    } else {
                        next(res.status(403).send("JsonWebTokenError"));
                    }
                });

            next();
        } else {
            next(res.status(403).send("EmptyToken"));
        }
    } catch (e) {
        next(res.status(401).send("UNAUTHORIZED"));
    }
};