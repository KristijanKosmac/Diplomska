import AWS from "aws-sdk";
import mock from "mock-require";

type PromiseResponse<T> = () => Promise<T>;

class S3 {

    putObject() {

        const response: PromiseResponse<AWS.S3.PutObjectOutput> = async () => {

            return {};
        };

        return { promise: response };
    }
}

(AWS.S3 as any) = S3;
mock("aws-sdk", AWS);
