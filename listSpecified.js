import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': path parameter
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.pathParameters.userId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Sort photos into correct order
    const photos = result.Items;
    photos.sort(function(a, b) {
      return a.imageRank - b.imageRank;
    });
    // Return the photos in response body
    return success(photos);
  } catch (e) {
    return failure({ status: false });
  }
}
