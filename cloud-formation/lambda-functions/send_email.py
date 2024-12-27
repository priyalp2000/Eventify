# https://www.courier.com/blog/three-ways-to-send-emails-using-python-with-code-tutorials/
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/secrets-manager.html
import smtplib
import boto3
import json
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    try:
        secret_name = "mySecretCredentials"
        region_name = "us-east-1"
        sqs_url = 'https://sqs.us-east-1.amazonaws.com/089054056517/store_messages'
        sqs_client = boto3.client("sqs")
        
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name,
        )
        
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        
        secret = json.loads(get_secret_value_response['SecretString'])
        sender_email = secret['email']
        password = secret['password']
        
        dynamo_db = boto3.resource('dynamodb')
        table = dynamo_db.Table('Events')
        
        for record in event['Records']:
            receiptHandle = record['receiptHandle']
            body = json.loads(record['body'])
            receiver_email = body['email']
            event_id = body['event_id']
            banner_id =body['banner_id']
            
            res = table.scan(FilterExpression=Attr('event_id').eq(event_id))
            
            event_name = res['Items'][0]['event_name']
            event_date = res['Items'][0]['event_date']
            event_time = res['Items'][0]['event_time']
            
            sent_from = sender_email
            to = [receiver_email]
            subject = 'Confirmation of Registration'
            body = 'Thankyou for your interest. Your registration is confirmed for the event.'+'\nEvent: '+event_name+'\nDate: '+event_date+'\nTime: '+event_time
            
            email_text = """\
From: %s
To: %s
Subject: %s

%s
            """ % (sent_from, ", ".join(to), subject, body)
            
            smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            smtp_server.ehlo()
            smtp_server.login(sender_email, password)
            smtp_server.sendmail(sent_from, to, email_text)
            smtp_server.close()
            print ("Email sent successfully!")
            
            dlt_response = sqs_client.delete_message(
                QueueUrl=sqs_url,
                ReceiptHandle=receiptHandle
                )
            
    except Exception as ex:
        print ("Something went wrong….",ex)
