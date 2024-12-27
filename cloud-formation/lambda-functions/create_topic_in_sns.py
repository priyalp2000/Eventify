import json
import boto3
import random
import logging
from boto3.dynamodb.conditions import Key, Attr

def create_response(status, message, data):
    return {
        "status": status,
        "message": message,
        "data": data
    }

def lambda_handler(event, context):
    try:
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('Events')
        
        body = event['body']
        body_json = json.loads(body)
        event_name = body_json['eventName']
        event_date = body_json['eventDate']
        event_description = body_json['eventDescription']
        event_time = body_json['eventTime']
        event_image = body_json['eventImage']
        event_id = body_json['eventId']
        
        res = table.put_item(
            Item={
              'event_name': event_name,    
              'event_description' : event_description,
              'event_image': event_image,
              'event_time' : event_time,
              'event_date': event_date,
              'event_id' : event_id
            })
    
        sns = boto3.client('sns')
        topic_name = 'SubscriberForEvents'
        t = sns.list_topics()
        topics = t['Topics']
        for t in topics:
            if topic_name in t['TopicArn']:
                topic_arn = t['TopicArn']
                break
            
        message = {
            'message':'New Event is here...\n Register soon...\nEvent Name: '+event_name+'\nEvent Date: '+event_date+'\nEvent Time: '+event_time
        }
        
        res1 = sns.publish(
            TopicArn=topic_arn,
            Message= message['message']
        )  
        response = create_response(True,"Event Added Successfully", None)
    
    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response
    
