import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { bool } from 'aws-sdk/clients/signer'
import {createLogger} from '../utils/logger'
import * as AWS from 'aws-sdk'

const bucketName = process.env.IMAGES_S3_BUCKET;
const expiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new AWS.S3({
  signatureVersion: "v4"
});

const todoAccess = new TodoAccess(
)

export async function getAllTodos(userId:String): Promise<TodoItem[]> {
  createLogger("getAllTodos")
  return todoAccess.getAllTodos(userId)
}

export async function deleteTodo(id:String,userId:String):Promise<bool>{
  createLogger("deleteTodo params "+id +  " "+userId)
  return todoAccess.deleteTodo(id,userId);
}

export async function getSignedUrl(id:String,userId:string){
  createLogger("signing params "+id +  " "+userId)
  const  item = await todoAccess.getTodo(id,userId);
  return s3.getSignedUrl('putObject',{
    Bucket: bucketName,
    Key: item.todoId,
    Expires: parseInt(expiration)
});
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    id:String,
    userId:string
):Promise<bool>{
    createLogger("updateTodo params")
    return todoAccess.updateTodo(updateTodoRequest,id,userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId:string
): Promise<TodoItem> {
  createLogger("createTodo params")
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    todoId: itemId,
    done: false,
    attachmentUrl : "http://example.com",
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString()
  })
}