from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import detail_route
from code.proghist.gausordering.ManyBinsGausingOrderBetaParamProducer import ManyBinsGausOrderingBetaParamProducer,\
    MyJsonEncoder
import json
from rest_framework.response import Response
from code.proghist.gausordering.AdaptableBinsGausingDataProducer import AdaptableBinsGausDataProducer
import os
import pathlib
from flask.globals import session
from .models import UserInteractionData
from django.core import serializers
from django.db import transaction

# Create your views here.



class ProgHistRest(APIView):
    pass
    
    #this works statically. you cannot change number of bins. it has default bins defined by hist variable.
    def get0(self, request):
        #hist=[ [0, 0.2, 10], [0.18, 0.23, 20], [0.25, 0.48, 30], [0.46, 0.60, 40], [0.55, 0.65, 50] ]
        #hist=[ [0, 0.4, 10], [0.3, 0.7, 10], [0.6, 0.99, 10] ]
        hist=[ [0, 0.99, 10], [0, 0.99, 10], [0, 0.99, 10] ]
        bpp = ManyBinsGausOrderingBetaParamProducer (hist = hist)
        data =bpp.binchanges
        print("djangoproghist.streaming.createdata\n")
        for c in bpp.binchanges:
            print("\n",c)
        print (bpp.binchanges)
        #return Response(json.dumps(data, cls=MyJsonEncoder))
        return Response(data)
    
# This has dynamic number of bins. you can change number of bins per request. there are default distributions for the characteristics of data
# Default is to have 3 gaussians in data.    
    def get(self, request):
        bincount = int(request.GET.get('bincount'))
        print("bincount", bincount)
        bpp = AdaptableBinsGausDataProducer ()
        
        sessionFilePath = os.path.join(os.getcwd(),"prog-hist-session.json")
        
        session_ = {}
        
        if pathlib.Path(sessionFilePath).exists():
            print (sessionFilePath)
            with open(sessionFilePath, 'r') as jsonFile:
                session_ = json.load(jsonFile)
        
        if 'data' not in session_ :
            print("no session data")
            bpp.produceData(datacount=10, chunksize=6)
            session_.update({'data': bpp.values})
                
        if 'discount' not in session_:
            session_.update({'distcount':3})
            
        
        bpp.values = session_['data']
        bpp.categorizeData(bincount=bincount)
        data =bpp.binchanges
        with open(sessionFilePath, 'w') as outfile:  
            json.dump(session_, outfile)
            
            
        #print(bpp.values)
        #return Response(json.dumps(data, cls=MyJsonEncoder))
        return Response(data)
    
    def post(self, request):
        return self.get(request)
    



class ProgHistRealDataRest(APIView):
    pass
    
   
# This has dynamic number of bins. you can change number of bins per request. there are default distributions for the characteristics of data
# Default is to have 3 gaussians in data.
    def get(self, request):
        bpp = AdaptableBinsGausDataProducer ()
        
        sessionFilePath = os.path.join(os.getcwd(),"prog-hist-session.json")
        
        session_ = {}
        
        if pathlib.Path(sessionFilePath).exists():
            print (sessionFilePath)
            with open(sessionFilePath, 'r') as jsonFile:
                session_ = json.load(jsonFile)
        
        if 'data' not in session_ :
            print("no session data")
            bpp.produceData (datacount=10, chunksize=6)
            session_.update({'data': bpp.values})
                
        if 'discount' not in session_:
            session_.update({'distcount':3})
        
        bpp.values = session_['data']
        data =bpp.values
        return Response(data)
    
    def post(self, request):
        return self.get(request)
    




class UserDataSaveRest(APIView):
    pass
    
   
    def get(self, request):
        
        return Response({})
    
    @transaction.atomic
    def post(self, request):
        print(json.loads(request.body))
        uid = UserInteractionData()
        uid.data = request.body
        
        uid.userName="halilagin"
        uid.personName="halil agin"
        uid.save()
        return self.get(request)
    
#    


class UserInteractionDataRest(APIView):
    pass
    
   
    def post(self, request, userinteraction_id):
        uid = UserInteractionData.objects.get(pk=userinteraction_id);
        
        return Response(json.loads(uid.data))
    
    def get(self, request, userinteraction_id):
        
        return self.post(request, userinteraction_id)


    
