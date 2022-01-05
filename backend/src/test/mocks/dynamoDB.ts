import AWS from "aws-sdk";
import * as HTTPStatus from "http-status-codes";
import mock from "mock-require";
import { codedError } from "../../lib/coded-error";
import { Dictionary } from "../../types/index";

type PromiseResponse<T> = () => Promise<T>;

class DocumentClient {
    private static readonly tables: Dictionary<any> = JSON.parse(JSON.stringify({}));

    delete(updateObject: { ExpressionAttributeValues: Dictionary<{}>, UpdateExpression: string, Key: { id: string } }) {

        if ((updateObject as any).TableName === "savingsTableName") {

            delete DocumentClient.tables[updateObject.Key.id];

        }
        if (updateObject.ExpressionAttributeValues && updateObject.ExpressionAttributeValues[":userDefinedTags"]) {

            delete DocumentClient.tables[updateObject.Key.id];

        }
        else if (updateObject.ExpressionAttributeValues && updateObject.ExpressionAttributeValues[":userDefinedCostAllocatedTags"]) {

            const indexFirstBracket = (updateObject.UpdateExpression.split("["))[1];
            const indexSecondBracket = (indexFirstBracket.split("]"))[0];
            DocumentClient.tables[updateObject.Key.id].userDefinedCostAllocatedTags.splice(indexSecondBracket, 0);

        } else {

            delete DocumentClient.tables[updateObject.Key.id];
        }

        const response: PromiseResponse<void> = async () => { };

        return { promise: response };
    }

    // tslint:disable-next-line:cyclomatic-complexity
    update(updateObject: { ExpressionAttributeValues: Dictionary<{}>, UpdateExpression: string, Key: { id: string } }) {

        if ((updateObject.Key! as any).id === "MOCKED_FOR_ERROR_DELETE_TWO") {
            throw codedError(HTTPStatus.NOT_FOUND, "Unable to find user");
        }

        const response: PromiseResponse<void> = async () => {

            if (updateObject.ExpressionAttributeValues[":payment"]) {
                return;
            }
            if (updateObject.ExpressionAttributeValues[":reimbursmentType"]) {
                return;
            }
            if (updateObject.ExpressionAttributeValues[":history"]) {
                return;
            }
            if (":hasInvoice" in updateObject.ExpressionAttributeValues) {
                return;
            }

            DocumentClient.tables[updateObject.Key.id].amount = updateObject.ExpressionAttributeValues[":amount"];
            DocumentClient.tables[updateObject.Key.id].date = updateObject.ExpressionAttributeValues[":date"];
            DocumentClient.tables[updateObject.Key.id].hourlyRate = updateObject.ExpressionAttributeValues[":hourlyRate"];
            DocumentClient.tables[updateObject.Key.id].minutes = updateObject.ExpressionAttributeValues[":minutes"];
            DocumentClient.tables[updateObject.Key.id].rate = updateObject.ExpressionAttributeValues[":rate"];
            DocumentClient.tables[updateObject.Key.id].rateCode = updateObject.ExpressionAttributeValues[":rateCode"];
        };

        return { promise: response };
    }

    put(params: AWS.DynamoDB.DocumentClient.PutItemInput) {

        const items = params.Item;
        DocumentClient.tables[items.id] = { ...items, history: [{ id: "15" }], invoiceNumber: "2020-5" };
        const response: PromiseResponse<void> = async () => { };

        return { promise: response };
    }

    query(params: AWS.DynamoDB.DocumentClient.QueryInput) {

        const response: PromiseResponse<AWS.DynamoDB.DocumentClient.QueryOutput> = async () => {

            DocumentClient.tables[Object.keys(DocumentClient.tables)[0]].hasInvoice = true;
            if (params.ExpressionAttributeValues![":id"] === "error") {

                throw codedError(HTTPStatus.BAD_REQUEST, "User doenst exist");
            }
            if (params.ExpressionAttributeValues![":anamnesis"]) {

                return { Items: [{ anamnesis: [] }] };
            }

            return { Items: [JSON.parse(JSON.stringify(DocumentClient.tables[Object.keys(DocumentClient.tables)[0]]))] };
        };

        return { promise: response };
    }
    scan(params: AWS.DynamoDB.DocumentClient.QueryInput) {

        const response: PromiseResponse<AWS.DynamoDB.DocumentClient.QueryOutput> = async () => {


            if (params.ExpressionAttributeValues![":id"] === "error") {

                throw codedError(HTTPStatus.BAD_REQUEST, "User doenst exist");
            }

            return { Items: [JSON.parse(JSON.stringify(DocumentClient.tables[Object.keys(DocumentClient.tables)[0]]))] };
        };

        return { promise: response };
    }
}

(AWS.DynamoDB.DocumentClient as any) = DocumentClient;
mock("aws-sdk", AWS);
