import boto3
from pymongo import MongoClient
import json

# 시크릿 제이슨 파일에서 환경 변수를 로드
with open('../config/secrets.json') as f:
    secrets = json.load(f)


FAST_API_MP_IP = secrets['FAST_API_MP_IP']
BACK_IP = secrets['BACK_IP']

MONGODB_ID_MP = secrets['MONGODB_ID_MP']
MONGODB_PASSWORD_MP = secrets['MONGODB_PASSWORD_MP']
S3_ACCESS_KEY_ID_MP= secrets['S3_ACCESS_KEY_ID_MP']
S3_SECRET_ACCESS_KEY_MP= secrets['S3_SECRET_ACCESS_KEY_MP']
S3_REGION_MP= secrets['S3_REGION_MP']
S3_BUCKET_NAME_MP= secrets['S3_BUCKET_NAME_MP']
MONGODB_PORT_MP= secrets['MONGODB_PORT_MP']
FAST_API_MP_IP_TEST= secrets['FAST_API_MP_IP_TEST']

# S3 설정

s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY_ID_MP,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY_MP,
    region_name=S3_REGION_MP
)
bucket_name = S3_BUCKET_NAME_MP

# MongoDB 설정
#mongo_client = MongoClient(f'mongodb://{MONGODB_ID_MP}:{MONGODB_PASSWORD_MP}@mongo_mp:{MONGODB_PORT_MP}')
mongo_client = MongoClient(f'mongodb://{MONGODB_ID_MP}:{MONGODB_PASSWORD_MP}@{FAST_API_MP_IP_TEST}:{MONGODB_PORT_MP}')
#비번도 바꿨음
db = mongo_client['videos']
collection = db['video']
