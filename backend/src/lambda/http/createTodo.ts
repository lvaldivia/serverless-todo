import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createTodo } from '../../businessLogic/todos'
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger("Getting create event "+event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  createLogger("Get user from JWT "+userId);
  const newItem = await createTodo(newTodo,userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item:newItem
    })
  }
}
