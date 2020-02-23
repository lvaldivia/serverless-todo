import 'source-map-support/register'


import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  createLogger("Getting delete event "+event);
  const userId = getUserId(event)
  createLogger("Get user from JWT "+userId);
  //solo falta esto
  return undefined
}