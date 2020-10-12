import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "doodleapp-db57d",
})

db = firestore.client()
guessDocs = db.collection(u'guesses')
sampleDocs = db.collection(u'samples').stream()

import json
import datetime
import os

totalDocsExtracted = 0
outputFolder = "C:/Users/Eyal/Documents/School/Thesis/PythonDBgrabber/currentpulledDB/"

if(not os.path.isdir(outputFolder)):
  os.makedirs(outputFolder)

for doc in sampleDocs:
    #print(u'{} => {}'.format(doc.id, doc.to_dict()))
    curSampleDict = doc.to_dict()
    val1 = curSampleDict["timeStamp"]
    year,month,day,hour,minute,second,tzinfo = val1.year,val1.month,val1.day,val1.hour, val1.minute, val1.second, val1.tzinfo
    curSampleDict["timeStamp"]  = "{}-{}-{} {}:{}:{}.{}".format(year, month, day,hour,minute,second,tzinfo)
    guessDoc = guessDocs.document(doc.id).get().to_dict()
    curSampleDict.update(guessDoc)
    jsonData = json.dumps(curSampleDict)
    with open(outputFolder+doc.id+".a","w+") as f:
        f.write(jsonData)
    totalDocsExtracted+=1

print("Total files extracted: "+str(totalDocsExtracted))
        
