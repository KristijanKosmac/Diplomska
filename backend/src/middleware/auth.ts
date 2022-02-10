import { admin } from "../firebase/index"

export const auth = async (req: any, res: any, next: any) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        if (token) {
            admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    console.log(decodedToken);
                })
                .catch((err: any) => {
                    if (err.errorInfo.code === "auth/id-token-expired") {
                        return res.status(403).send('TokenExpiredError');
                    } else {
                        return res.status(403).send("JsonWebTokenError");
                    }
                });

            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (e) {
        console.log(e)
        res.status(404).send({ error: "Not authorized" });
    }
};