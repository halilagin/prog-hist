from code.test.playground.chapter08_10 import Chapter08_10
from code.proghist.gausordering import  GausingOrderBetaParamProducer

import bottle
from bottle import Bottle, request, response, route, run
import json

from beaker.middleware import SessionMiddleware
from code.proghist.gausordering.BinChangesByEntropy import BinChangesByEntropy

#https://github.com/tomastrajan/react-typescript-webpack/blob/master/src/auth/auth.service.ts

session_opts = {
    'session.type': 'file',
    'session.cookie_expires': 300000,
    'session.data_dir': './data',
    'session.auto': True
}
app = SessionMiddleware(bottle.app(), session_opts)



@bottle.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@route('/hello')
def hello():
    return "Hello World!"


@route('/rest1')
def rest1():
    return json.dumps([1,2,3,4,56])


@route('/set-session')
def setSession():
    return json.dumps([1,2,3,4,56])


@route('/get-session')
def getSession():
    return json.dumps([1,2,3,4,56])


@bottle.route('/sessiontest')
def test():
    s = bottle.request.environ.get('beaker.session')
    s['test'] = s.get('test',1) + 1
    s.save()
    return 'Test counter: %d' % s['test']



@bottle.route('/proghist/streaming/createdata', method=['OPTIONS', 'GET'])
def proghist_streaming_createdata():
    if request.method == 'OPTIONS':
        return {}
    
    s = bottle.request.environ.get('beaker.session')
    bce = BinChangesByEntropy()
    bpp = GausingOrderBetaParamProducer.GausOrderinBetaParamProducer (hist = [ [0.2, 0.45, 10], [0.4, 1.0, 20] ])
    
    data = bpp.betaBernoulli3BinsRead(datacount=10, chunkSize=6)
    data.append(bce.determineChangeOfBins(data[3]))
    s["hist"] = data
    s.save()
    return json.dumps(s.get("hist", None))

@bottle.route('/proghist/streaming/data/<index:int>', method=['OPTIONS', 'GET'])
def proghist_streaming_data(index):
    if request.method == 'OPTIONS':
        return {}
    s = bottle.request.environ.get('beaker.session')
    data =s.get("hist", None)
    binSizes, origData, catData, freqs = data 
    map_ = {}
    map_["binSizes"] = binSizes
    map_["origData"] = origData[index]
    map_["catData"] = catData[index]
    map_["freqs"] = freqs[index]
    print(map_)
    return json.dumps(map_)

#bottle.run(app=app, host='localhost', port=5000, debug=True)



if __name__ == '__main__':
    from optparse import OptionParser
    parser = OptionParser()
    parser.add_option("--host", dest="host", default="localhost",
                      help="hostname or ip address", metavar="host")
    parser.add_option("--port", dest="port", default=5000,
                      help="port number", metavar="port")
    (options, args) = parser.parse_args()
    
    run(app, host=options.host, port=int(options.port))
