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
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('UserDetails')
        subscription_table = dynamo_db.Table('SubscribedUsers')


        queue_client = boto3.client('sqs')
        queue_name = 'store_messages'
        
        url = queue_client.get_queue_url(QueueName=queue_name, QueueOwnerAWSAccountId='830863794950')
        queue_url = url['QueueUrl']
        
        r1 = random.randint(10, 100000)
        
        body = event['body']
        body_json = json.loads(body)
        banner_id = body_json['bannerId']
        name = body_json['name']
        email = body_json['email']
        event_id = body_json['eventId']
        checkbox = body_json['checkBox']
        id = str(r1)
        
        if checkbox:
            res1 = subscription_table.scan(FilterExpression=Attr('user_email').eq(email))
            if res1['Count'] == 0:
                res2 = subscription_table.put_item(
                    Item={
                      'user_email': email,    
                      'name' : name,
                      'banner_id': banner_id,
                    })
                sns = boto3.client('sns')
                topic_name = 'SubscriberForEvents'
                t = sns.list_topics()
                topics = t['Topics']
                for t in topics:
                    if topic_name in t['TopicArn']:
                        topic_arn = t['TopicArn']
                        break
                
                res1 = sns.subscribe(
                    TopicArn=topic_arn,
                    Protocol='email',
                    Endpoint=email
                )
                print("User subscribed for notification successfully...")
            else:
                print("User has already subscribed...")
                
            
        res = table.scan(FilterExpression=Attr('banner_id').eq(banner_id) & Attr('event_id').eq(event_id))
        if res['Count'] == 0:
            res = table.put_item(
                Item={
                  'user_id': id,    
                  'name' : name,
                  'banner_id': banner_id,
                  'email' : email,
                  'event_id' : event_id
                })
                
            message = {'email': email, 'name': name, 'banner_id': banner_id, 'event_id': event_id}
            queue_client.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))
            response = create_response(True,"Registered successfully... You will receive an email about confirmation soon...", None)
        
        else:
            response = create_response(True,"You have already registered for this event.", None)
            
    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response
