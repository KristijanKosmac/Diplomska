import AWS from "aws-sdk";
import mock from "mock-require";

type PromiseResponse<T> = () => Promise<T>;

class SES {

    sendEmail() {

        const response: PromiseResponse<AWS.SES.SendEmailResponse> = async () => {

            return {
                MessageId: "1328831291832918239382"
            };
        };

        return { promise: response };
    }
}

(AWS.SES as any) = SES;
mock("aws-sdk", AWS);
