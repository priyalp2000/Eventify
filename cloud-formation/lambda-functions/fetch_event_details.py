import json
import boto3
import random
import logging
from boto3.dynamodb.conditions import Key, Attr

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

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
        table = dynamo_db.Table('Events')

        events = []
        
        res = table.scan()
        logger.info(res)
        if res['Count'] == 0:
            response = create_response(True,"No Events Found.", None)
        else:
            logger.info(res)
            for i in range(res['Count']):
                dictionary = {}
    
                event_name = res['Items'][i]['event_name']
                event_id = res['Items'][i]['event_id']
                event_description = res['Items'][i]['event_description']
                event_date = res['Items'][i]['event_date']
                event_time = res['Items'][i]['event_time']
                event_image = res['Items'][i]['event_image']
                
                dictionary['eventName'] = event_name
                dictionary['eventId'] = event_id
                dictionary['eventDescription'] = event_description
                dictionary['eventDate'] = event_date
                dictionary['eventTime'] = event_time
                dictionary['eventImage'] = event_image

                events.append(dictionary)
          
            response = create_response(True, "events fetched successfully", events)

    except Exception as e:
        response = create_response(False, str(e), None)
        raise e
        
    return response
