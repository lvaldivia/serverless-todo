import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getAllTodos } from '../../businessLogic/todos'
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    createLogger("Get todo event "+event);
    const userId = getUserId(event);
    createLogger("Get user from JWT "+userId);
    const items = await getAllTodos(userId)

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          items:items
        })
      }
}