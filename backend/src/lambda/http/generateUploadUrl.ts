import 'source-map-support/register'


import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'
import {getSignedUrl } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  createLogger("Getting delete event "+event);
  const userId = getUserId(event)
  createLogger("Get user from JWT "+userId);
  const url = await getSignedUrl(todoId,userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ 
      uploadUrl: url
    })
  }
}