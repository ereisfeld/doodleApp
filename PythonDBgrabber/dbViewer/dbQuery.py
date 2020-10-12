import pandas
import os
import json
import glob
from datetime import date

dbFiles = r"C:\Users\Eyal\Documents\School\Thesis\PythonDBgrabber\currentpulledDB"
df = pandas.DataFrame()
dfFileOrigin = -1

def buildDataframe():
    '''
    builds the dataframe from the files in dbFiles. Saves it into an excel and a json with the new dfFileOrigin.
    '''
    global dbFiles
    today = date.today()
    df = pandas.DataFrame()
    for file in glob.glob(os.path.join(dbFiles,"*.a")):
        with open(os.path.join(dbFiles,file),"r") as f:
            jsonData = json.load(f)
            df = df.append(jsonData,ignore_index=True)
    dfFileOrigin = os.path.join("./outputDB/",today.strftime(r"%d_%m_%Y"))
    df.to_excel(dfFileOrigin+".xlsx")
    df.to_json(dfFileOrigin+".json")

def loadDataframe(pathToExcel):
    '''
    given an already created excel. load it into a dataframe
    '''
    global df
    global dfFileOrigin
    dfFileOrigin=pathToExcel
    df = pandas.read_excel(pathToExcel+".xlsx", index_col=0)
    
def queryDataFrame(postFix):
    '''
    creates new json and excel with filtered entries. Its name will be originalExcel_postFix
    '''
    global df
    global dfFileOrigin
    query = "mail == ''"
    #df = df.query(query)
    df=df.dropna()
    df.to_excel(dfFileOrigin+"_"+postFix+".xlsx")
    df.to_json(dfFileOrigin+"_"+postFix+".json")

#buildDataframe()
pathToExcel = os.path.join("./outputDB/","11_08_2020")
loadDataframe(pathToExcel)
queryDataFrame("emptyMail")
