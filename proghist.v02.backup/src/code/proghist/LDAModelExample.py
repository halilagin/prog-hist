import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize
from filterpy.discrete_bayes import predict
from filterpy.discrete_bayes import update
from scipy.ndimage import measurements
import filterpy.stats as stats
from filterpy.stats import gaussian, multivariate_gaussian
from numpy.random import randn,seed
from filterpy.kalman import KalmanFilter
from filterpy.common import Q_discrete_white_noise
from scipy.stats import beta
from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from gensim import corpora, models
import gensim

import gensim
from code.proghist.BetaParamProducer import BetaParamProducer


#https://github.com/aloctavodia/Doing_bayesian_data_analysis
class LDAModelExample(object):
    def __init__(self):
        pass
    
    def N0(self,x):
        return (1/np.sqrt(2*np.pi)) * np.exp(-.5 * (x)**2)

    
    def test1(self):
        pass
        bpp = BetaParamProducer()
        bins = bpp.betaBernoulli3BinsRvs(datacount=100, heightFactors=[[1,0,2]])
        binMembers = [ int(bins[i] * 100) for i in range(len(bins)) ]
        binMembers = np.array(binMembers)
        binMembers_y = np.bincount(binMembers)
        binMembers_ii = np.nonzero(binMembers_y)[0]
        z = zip(binMembers_ii,binMembers_y[binMembers_ii])
        z_l = list(z)
        x,y = zip(*z_l)
        print(z_l)
        plt.scatter(x,y)
        plt.show() 
    
    def lda3Bins(self):
        pass
        bpp = BetaParamProducer()
        bins = bpp.betaBernoulli3BinsRvs(datacount=100, heightFactors=[[1,0,2]])
        binMembers = [ int(bins[i] * 100) for i in range(len(bins)) ]
        binMembers = np.array(binMembers)
        binMembers_y = np.bincount(binMembers)
        binMembers_ii = np.nonzero(binMembers_y)[0]
        z = zip(binMembers_ii,binMembers_y[binMembers_ii])
        z_l = list(z)
        x,y = zip(*z_l)
        
        dict_ = np.unique(binMembers)
        list_ = dict_.tolist()
        docs = []
        for i in range(len(bpp.ranges)):
            docs.append([])
        
        
        
        for item in list_:
            for i, range_ in enumerate(bpp.ranges):
                l,h = range_
                l = int(l *100)
                h = int(h*100)
                if item>=l and item<=h:
                    docs[i].append(str(item))
        
        dictionary = corpora.Dictionary(docs)
        corpus = [dictionary.doc2bow(text) for text in docs]
        ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=3, id2word = dictionary, passes=20)
        print(ldamodel.print_topics(num_topics=3, num_words=5))

        #print (docs)
        
    def start(self):
        
        tokenizer = RegexpTokenizer(r'\w+')

        # create English stop words list
        en_stop = get_stop_words('en')
        
        # Create p_stemmer of class PorterStemmer
        p_stemmer = PorterStemmer()
            
        # create sample documents
        doc_a = "Brocolli is good to eat. My brother likes to eat good brocolli, but not my mother."
        doc_b = "My mother spends a lot of time driving my brother around to baseball practice."
        doc_c = "Some health experts suggest that driving may cause increased tension and blood pressure."
        doc_d = "I often feel pressure to perform well at school, but my mother never seems to drive my brother to do better."
        doc_e = "Health professionals say that brocolli is good for your health." 
        
        # compile sample documents into a list
        doc_set = [doc_a, doc_b, doc_c, doc_d, doc_e]
        
        # list for tokenized documents in loop
        texts = []
        
        # loop through document list
        for i in doc_set:
            
            # clean and tokenize document string
            raw = i.lower()
            tokens = tokenizer.tokenize(raw)
        
            # remove stop words from tokens
            stopped_tokens = [i for i in tokens if not i in en_stop]
            
            # stem tokens
            stemmed_tokens = [p_stemmer.stem(i) for i in stopped_tokens]
            
            # add tokens to list
            texts.append(stemmed_tokens)
        
        print (texts)
        # turn our tokenized documents into a id <-> term dictionary
        dictionary = corpora.Dictionary(texts)
            
        # convert tokenized documents into a document-term matrix
        corpus = [dictionary.doc2bow(text) for text in texts]
        
        # generate LDA model
        ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=2, id2word = dictionary, passes=20)
        print(ldamodel.print_topics(num_topics=2, num_words=4))
        # turn our tokenized documents into a id <-> term dictionary
        #dictionary = corpora.Dictionary(texts)
            
        # convert tokenized documents into a document-term matrix
        #corpus = [dictionary.doc2bow(text) for text in texts]
        
        # generate LDA model
        #ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=2, id2word = dictionary, passes=20)
    
def main():
    dp = LDAModelExample()
    dp.test1()
    #dp.start()
    
    #dp.lda3Bins()

if __name__ == "__main__": main()

