import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "doodleapp-db57d",
})

db = firestore.client()
guessDocs = db.collection(u'guesses').stream()
sampleDocs = db.collection(u'samples').stream()

import json
import datetime

totalDocsExtracted = 0
outputFolder = "C:/Users/Eyal/Documents/School/Thesis/PythonDBgrabber/currentpulledDB/"

for doc in sampleDocs:
    #print(u'{} => {}'.format(doc.id, doc.to_dict()))
    curSampleDict = doc.to_dict()
    val1 = curSampleDict["timeStamp"] 
    year,month,day,hour,minute,second,tzinfo = val1.year,val1.month,val1.day,val1.hour, val1.minute, val1.second, val1.tzinfo
    curSampleDict["timeStamp"]  = "{}-{}-{} {}:{}:{}.{}".format(year, month, day,hour,minute,second,tzinfo)
    jsonData = json.dumps(curSampleDict)
    with open(outputFolder+doc.id+".a","w+") as f:
        f.write(jsonData)
    totalDocsExtracted+=1

print("Total files extracted: "+totalDocsExtracted)
        
