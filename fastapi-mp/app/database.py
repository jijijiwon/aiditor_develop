from app.configdb import collection


def extract_number(s):
    return int(''.join(filter(str.isdigit, s)))

def insert_video_document(document):
    collection.insert_one(document)

def find_video_document(worknum):
    return collection.find_one({"worknum": worknum})

def update_video_document(worknum, update_fields):
    collection.update_one({"worknum": worknum}, {"$set": update_fields})


def find_pending_documents():
    pending_list = []
    documents = collection.find({"job_ok": 0})
    for doc in documents:
        pending_list.append(doc['worknum'])

    # 정렬된 리스트
    pending_sorted_list = sorted(pending_list, key=extract_number)
    return pending_sorted_list

def find_error_documents(worknum):
    document = collection.find_one({"worknum": worknum})

    if document and 'error_message' in document:
        return document['error_message']
    else:
        return None

