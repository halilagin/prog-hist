import code.book_plots as bp
import code.gh_internal as gh
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
from code.DogSimulation import DogSimulation
from code import kf_internal
from filterpy.kalman import predict, update
from filterpy.kalman import KalmanFilter
from filterpy.common import Q_discrete_white_noise
from code.mkf_internal import plot_track
from scipy.linalg import block_diag
import math

from sklearn.cluster import MiniBatchKMeans, KMeans

#from scipy.cluster.vq import vq, kmeans, whiten
#from sklearn.cluster import MiniBatchKMeans
from sklearn.datasets.samples_generator import make_blobs

class DataProducer(object):
    def __init__(self):
        pass
    
    
    def read(self, datacount,gaussians):
        #gauissians=[(m1, var1)]
        #np.random.seed(2017)
        bins = []
        for mu,var in gaussians:
            bin_ = np.random.normal(mu, math.sqrt(var), datacount)
            bins.append(bin_)
        return bins

class BinWrapper(object):
    bins=[]
    iteration=0
    previousBinrow=[]
    allData=[]
    
    def __init__(self):
        #self.bins=np.array([  [0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]  ])
        pass
    
    
    def read(self, datacount, binCount, gaussians):
        dp = DataProducer()
        gaussValues = dp.read(datacount, gaussians)
        
        arr = np.sort(np.concatenate( gaussValues, axis=0 )).tolist()
        binPopulation = int( len(arr) / binCount);
        
        binsrow = [ [0],[0],[0],[0] ] 
        for i in range(binCount):
            bin_=arr[(i*binPopulation):((i+1)*binPopulation)]
            Vx = 0
            Vy = 0
            if i==0:
                binsrow =  [ [np.mean(bin_)], [Vx], [binPopulation], [Vy]   ]
            else:
                binsrow = binsrow + [ [np.mean(bin_)], [Vx], [binPopulation], [Vy]   ]
        
        if self.iteration==0:
            pass
        else:
            
            for i in range(len(binsrow)):
                if (i%binCount==0):
                    binsrow[i][0] = (self.previousBinrow[i][0]+binsrow[i][0])/2
                elif (i%binCount==2):
                    binsrow[i][0] = self.previousBinrow[i][0]+binsrow[i][0]
                
        
        self.iteration+=1
        self.previousBinrow = binsrow
        self.allData.append(binsrow)
        return binsrow # [[x, y]]

    #drawnow(self.draw_fig, show_once=False, confirm=False)
    def draw_fig(self):
        plt.clf()
        plt.scatter(self.bins[:,0], self.bins[:,1])



class BinWrapperWithKmeans(object):
    bins=[]
    iteration=0
    previousBinrow=[]
    
    
    def __init__(self):
        self.allData=np.zeros( shape=(0, 1) )  # [[0]]
        self.kmeans = KMeans(init='k-means++', n_clusters=4, n_init=10)
        #self.allData = np.delete(self.allData, (0), axis=0)
        
        #self.allData.shape = (0,2)
        #self.bins=np.array([  [0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]  ])
        pass
    
    
    def read(self, datacount, binCount, gaussians):
        Vx = 0.01
        Vy = 0.01
        dp = DataProducer()
        gaussValues = dp.read(datacount, gaussians)
        
        arr = np.concatenate( gaussValues, axis=0 )
        newarr = [ [ x ] for x in arr]
        self.allData= np.concatenate([self.allData,newarr])
        
        
        self.kmeans.fit(self.allData)
        kmeansBins = np.unique(self.kmeans.labels_, return_counts=True)
        #kmeansBins[1][0],kmeansBins[1][1],kmeansBins[1][2],kmeansBins[1][3],
        
        centers = [ [self.kmeans.cluster_centers_[i].tolist(),  kmeansBins[1][i]] for i in range(len(self.kmeans.cluster_centers_)) ]
        sortedCenters = sorted (centers, key=lambda l:l[0])
        binsrow = [ [0], [0], [0], [0] ]
        
        for i  in range(len(sortedCenters)):
            center = sortedCenters[i]
            #kmeans.cluster_centers_
            ar_ = [ [ center[0][0] ], [Vx], [ center[1] ], [Vy] ]
            if i==0:
                binsrow =  ar_
            else:
                binsrow = binsrow + ar_
        
        self.iteration+=1
        self.previousBinrow = binsrow
        return binsrow # [[x, y]]

    #drawnow(self.draw_fig, show_once=False, confirm=False)
    def draw_fig(self):
        plt.clf()
        plt.scatter(self.bins[:,0], self.bins[:,1])


class ProgHistKalmanFilter(object):
    R_std = 0.35
    Q_std = 0.04
    
    def __init__(self):
        pass
    
    #drawnow(self.draw_fig, show_once=False, confirm=False)
    def draw_fig(self):
        bp.bar_plot(self.belief)
    
    def kfilter(self):
        tracker = KalmanFilter(dim_x=16, dim_z=16)
        dt = 1.0   # time step
        d3 = 0.0  #d-triangle, correlation between VXs
        dc = 0.0  #d-circle, correlation between VYs
        a=1
        #cx1=1,cx2=0.5,cx3=0.25
        
        
        tracker.F = np.array([#x1   vx   y1   vy   x2   vx2   y2   vy2   x3   vx3   y3  vy3   x4  vx4   y4   vy4
                              [1,   dt,  0,   0,   a,   0,    0,   0,    0,   0,    0,   0,   0,   0,   0,   0],#x1
                              [0,   1,   0,   0,   0,   a,    0,   0,    0,   0,    0,   0,   0,   0,   0,   0],#vx1
                              [0,   0,   1,   dt,  0,   0,    a,   0,    0,   0,    0,   0,   0,   0,   0,   0],#y1
                              [0,   0,   0,   1,   0,   0,    0,   a,    0,   0,    0,   0,   0,   0,   0,   0],#vy1
                              [0,   0,   0,   0,   1,   dt,   0,   0,    a,   0,    0,   0,   0,   0,   0,   0],#x2
                              [0,   0,   0,   0,   0,   1,    0,   0,    0,   a,    0,   0,   0,   0,   0,   0],#vx2
                              [0,   0,   0,   0,   0,   0,    1,   dt,   0,   0,    a,   0,   0,   0,   0,   0],#y2
                              [0,   0,   0,   0,   0,   0,    0,   1,    0,   0,    0,   a,   0,   0,   0,   0],#vy2
                              [0,   0,   0,   0,   0,   0,    0,   0,    1,   dt,   0,   0,   a,   0,   0,   0],#x3
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   1,    0,   0,   0,   a,   0,   0],#vx3
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    1,   dt,  0,   0,   a,   0],#y3
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    0,   1,   0,   0,   0,   a],#vy3
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    0,   0,   1,   dt,  0,   0],#x4
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    0,   0,   0,   1,   0,   0],#vx4
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    0,   0,   0,   0,   1,   dt],#y4
                              [0,   0,   0,   0,   0,   0,    0,   0,    0,   0,    0,   0,   0,   0,   0,   1]#vy4
                             ]
                              )
        tracker.u = 0.
        tracker.H = np.array([
                                [1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0],
                                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1]
                            ])
    
        tracker.R = np.eye(16) * self.R_std**2
        q = Q_discrete_white_noise(dim=2, dt=dt, var=self.Q_std**2)
        tracker.Q = block_diag(q, q) #tracker.Q.dim = 4
        tracker.Q = block_diag(tracker.Q, tracker.Q) #tracker.Q.dim = 8
        tracker.Q = block_diag(tracker.Q, tracker.Q) #tracker.Q.dim = 16
        
        v=0.00001
        tracker.x = np.array([[0, v,  0,  v,  0,  v,  0,  v,  0,  v,  0,  v,  0,  v,  0,  v]]).T
        tracker.P = np.eye(16) * 225.  # (3*5)^2, 25,35,75,85 araliginda 5er li dagilim in 3 sigma variansi.
        return tracker

    
    def test_dataproducer(self):
        pass
        dp = DataProducer()
        datacount=10
        gaussians = [ (25,25), (35,25), (75,25), (90,25) ] # [ (mu,sigma^2)]
        bins = dp.read(datacount, gaussians)
        print(bins)
        

    def test_binwrap(self):
        bw = BinWrapper()
        
        for i in range(100):
            bins_ = bw.read(10, 4, [ (25,25), (35,25), (75,25), (90,25) ])
            print(bins_)
    
    
    def test_binwrap_kmeans(self):
        bw = BinWrapperWithKmeans()
        
        for i in range(10):
            bins_ = bw.read(10, 4, [ (25,25), (35,25), (75,25), (90,25) ])
            print(bins_)
        
    def run(self):
        
        #bw = BinWrapper()
        bw = BinWrapperWithKmeans()
        bins=[]
        for i in range(10):
            bins_ = bw.read(2, 4, [ (30,25), (35,25), (40,25), (45,25) ])
            bins.append(bins_)
        
        kf = self.kfilter()
        
        mu, cov, _, _ = kf.batch_filter(bins)
        np.set_printoptions(precision=3, linewidth=220, suppress=True )
        
        print ("\n====\n")
        print (cov[9])
       
        for c in cov:
            covlist = [ c[4+i][i] for i in range(12) ]   
            str=""
            for i in range(3):
                a = "x{}-x{}:{:2.3f}, vx{}-vx{}:{:2.3f}, y{}-y{}:{:2.3f}, vy{}-vy{}:{:2.3f}".format( i+1, i+2, covlist[i*4], i+1, i+2, covlist[i*4+1],i+1, i+2, covlist[i*4+2], i+1, i+2, covlist[i*4+3])
                str = str+a
            print (str)
        
def main():
    phkf = ProgHistKalmanFilter()
    #phkf.test_binwrap_kmeans()
    
    phkf.run()
if __name__ == "__main__": main()

