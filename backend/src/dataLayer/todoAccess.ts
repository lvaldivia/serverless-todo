import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


import { TodoItem } from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import { bool } from 'aws-sdk/clients/signer'
const XAWSRay = AWSXRay.captureAWS(AWS);

export class TodoAccess {

  constructor(
    
    private readonly docClient: DocumentClient = new XAWSRay.DynamoDB.DocumentClient(),
    private readonly indexName = process.env.INDEX_NAME,
    private readonly todoTable = process.env.TODOS_TABLE) {
  }

  async deleteTodo(id:String,userId:String):Promise<bool>{
    await this.docClient.delete({
      TableName: this.todoTable,
      Key:{
        "todoId" : id,
        "userId" : userId
      }
    }).promise();
    return true;
  }


  async getAllTodos(userId:String): Promise<TodoItem[]> {
    console.log('Getting all Todos')

    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName : this.indexName,
      KeyConditionExpression: "#u = :user_id",
      ExpressionAttributeNames :{
        "#u": "userId",
      },
      ExpressionAttributeValues:{
          ":user_id" : userId
      },
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(id:String,userId:string):Promise<TodoItem>{
    console.log(id," ",userId);
    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName : this.indexName,
      KeyConditionExpression: "#t = :todoId, #u = :userId",
      ExpressionAttributeNames :{
        "#t": "todoId",
        "#u": "userId"
      },
      ExpressionAttributeValues:{
          ":todoId" : id,
          ":userId" : userId
      },
    }).promise()
    if(result.Items.length>0){
      return result.Items[0] as TodoItem;
    }
    return null;

  }

  async updateTodo(todo:TodoUpdate,id:String,userId:string):Promise<bool>{
    await this.docClient.update(
      {
        TableName:this.todoTable,
        Key:{
          "todoId" : id,
          "userId" : userId
        },
        UpdateExpression: "set #n=:n, #dd=:dd,#d=:d",
        ExpressionAttributeNames :{
          "#n": "name",
          "#dd": "dueDate",
          "#d": "done"
        },
        ExpressionAttributeValues:{
          ":n" : todo.name,
          ":dd" : todo.dueDate,
          ":d" : todo.done
        },
        ReturnValues:"UPDATED_NEW"
      }
    ).promise();

    return true;
  }

  async updateImage(url:String,id:String,userId:string):Promise<bool>{
    await this.docClient.update(
      {
        TableName:this.todoTable,
        Key:{
          "todoId" : id,
          "userId" : userId
        },
        UpdateExpression: "set #n=:n",
        ExpressionAttributeNames :{
          "#n": "attachmentUrl"
        },
        ExpressionAttributeValues:{
          ":n" : url,
        },
        ReturnValues:"UPDATED_NEW"
      }
    ).promise();

    return true;
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
}
