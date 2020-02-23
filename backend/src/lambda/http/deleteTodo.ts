import 'source-map-support/register'
import {deleteTodo } from '../../businessLogic/todos'
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger("Getting delete event "+event);
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  await deleteTodo(todoId,userId);
  createLogger("Get user from JWT "+userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ 
    })
  }
}