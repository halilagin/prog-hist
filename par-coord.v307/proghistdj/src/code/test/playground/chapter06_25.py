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

class Chapter06_25(object):
    
    
   
    def __init__(self):
        pass
    
    def pos_vel_filter(self, x, P, R, Q=0., dt=1.0):
        """ Returns a KalmanFilter which implements a
        constant velocity model for a state [x dx].T
        """
        
        kf = KalmanFilter(dim_x=2, dim_z=1)
        kf.x = np.array([x[0], x[1]]) # location and velocity
        kf.F = np.array([[1., dt],
                         [0.,  1.]])  # state transition matrix
        kf.H = np.array([[1., 0]])    # Measurement function
        kf.R *= R                     # measurement uncertainty
        if np.isscalar(P):
            kf.P *= P                 # covariance matrix 
        else:
            kf.P[:] = P               # [:] makes deep copy
        if np.isscalar(Q):
            kf.Q = Q_discrete_white_noise(dim=2, dt=dt, var=Q)
        else:
            kf.Q[:] = Q
        return kf
    
    def compute_dog_data(self, z_var, process_var, count=1, dt=1.):
        "returns track, measurements 1D ndarrays"
        x, vel = 0., 1.
        z_std = math.sqrt(z_var) 
        p_std = math.sqrt(process_var)
        xs, zs = [], []
        for _ in range(count):
            v = vel + (randn() * p_std * dt)
            x += v*dt        
            xs.append(x)
            zs.append(x + randn() * z_std)        
        return np.array(xs), np.array(zs)

    
    
    
    def draw_fig1(self):
        plt.scatter(self.sc1X, self.sc1Y)
        plt.scatter(self.sc2X,self.sc2Y)
        
    
    
    def run(self,x0=(0.,0.), P=500, R=0, Q=0, dt=1.0, 
        track=None, zs=None,
        count=0, do_plot=True, **kwargs):
        """
        track is the actual position of the dog, zs are the 
        corresponding measurements. 
        """
    
        # Simulate dog if no data provided. 
        if zs is None:
            track, zs = self.compute_dog_data(R, Q, count)
    
        # create the Kalman filter
        kf = self.pos_vel_filter(x0, R=R, P=P, Q=Q, dt=dt)  
    
        # run the kalman filter and store the results
        xs, cov = [], []
        for z in zs:
            kf.predict()
            kf.update(z)
            xs.append(kf.x)
            cov.append(kf.P)
    
        xs, cov = np.array(xs), np.array(cov)
        if do_plot:
            plot_track(xs[:, 0], track, zs, cov, 
                       dt=dt, **kwargs)
        return xs, cov
    
    
    def start(self):
        P = np.diag([500., 49.])
        Ms, Ps = self.run(count=50, R=10, Q=0.01, P=P)
        
def main():
    ch = Chapter06_25()
    ch.start()
    

if __name__ == "__main__": main()

