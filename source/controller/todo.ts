import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import config from '../config/config';


require('dotenv').config();

let tableName = 'Todos'
let user_id = uuidv4();
let user_name = 'test-dynamo-db'

let awsconfig = {
    "region":config.aws.region,
    "endpoint":config.aws.endpoint,
    "accessKeyId":config.aws.accessKeyId, 
    "secretAccessKey":config.aws.secretAccessKey
};
AWS.config.update(awsconfig);

var docClient = new AWS.DynamoDB.DocumentClient();

const getAllTodos = (req:Request, res:Response) => {
    var params = {
        TableName: "Todos",
        ProjectionExpression: "#id, #name, #dueDate",
        ExpressionAttributeNames: {
            "#id": "todo_id",
            "#name": "name",
            "#dueDate":"due_date"
        }
    };

    console.log("Scanning todo table.");
    docClient.scan(params, onScan);

    function onScan(err:any, data:any){
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        }
        else{
            res.send(data)
            console.log("Scan succeeded.");
            data.Items.forEach(function(todo: any) {
                console.log(todo.todo_id, todo.name)
             }); 
        }
    }
}

const createTodo = (req:Request, res:Response) => {
    let item = req.body.Item;
    item.todo_id = uuidv4();
    item.user_id = user_id ;
    item.user_name = user_name;

    docClient.put({
        TableName:tableName ,
        Item: item
    }, (err, data) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                message:err.message,
                status: err.statusCode
            })
        }else{
            return res.status(200).send(item)
        }
    })
}

const updateTodo = (req:Request, res:Response) => {
    let item = req.body.Item;

    docClient.put({
        TableName:tableName ,
        Item: item,
        ConditionExpression: '#id = :id',
        ExpressionAttributeNames :{
            '#id' : 'todo_id'
        },
        ExpressionAttributeValues :{
            ':id' : item.todo_id
        }
    }, (err, data) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                message:err.message,
                status: err.statusCode
            })
        }else{
            return res.status(200).send(item);
        }
    })
}

const getTodoById = (req:Request, res:Response) => {
    let todo_id = req.params.todo_id
    let param = {
        TableName: tableName,
        IndexName: "todo_id-index",
        KeyConditionExpression : "todo_id = :todo_id",
        ExpressionAttributeValues:{
            ":todo_id":todo_id
        },
        limit:1
    }
    docClient.query(param, (err, data) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                message:err.message,
                status:err.statusCode
            })
        }
        else{
            return res.status(200).send(data.Items);
        }
    })
}


const getTodoByName = (req:Request, res:Response) => {
    let name = req.params.name

    let param = {
        TableName: tableName,
        KeyConditionExpression : "name = :name",
        ExpressionAttributeValues:{
            ":name":name
        },
        limit:1
    }
    docClient.query(param, (err, data) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                message:err.message,
                status:err.statusCode
            })
        }
        else{
            return res.status(200).send(data.Items);
        }
    })
}

const deleteTodo = (req:Request, res:Response) => {
    let todo_id = req.params.todo_id
    let params = {
        TableName:tableName,
        Key:{
            todo_id:todo_id
        }
    }

    docClient.delete(params, (err, data) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                message:err.message,
                status:err.statusCode
            })
        }else{
            return res.json({
                message:'Todo Deleted'
            });
        }
    })
}

export default { getAllTodos, createTodo, updateTodo, getTodoById, getTodoByName, deleteTodo};
