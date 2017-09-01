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


class PosSensor1(object):
    def __init__(self, pos=(0, 0), vel=(0, 0), noise_std=1.):
        self.vel = vel
        self.noise_std = noise_std
        self.pos = [pos[0], pos[1]]
        
    def read(self):
        self.pos[0] += self.vel[0]
        self.pos[1] += self.vel[1]
        
        return [self.pos[0] + randn() * self.noise_std,
                self.pos[1] + randn() * self.noise_std]

class ConstantVelocityObject(object):
    def __init__(self, x0=0, vel=1., noise_scale=0.06):
        self.x = x0
        self.vel = vel
        self.noise_scale = noise_scale

    def update(self):
        self.vel += randn() * self.noise_scale
        self.x += self.vel
        return (self.x, self.vel)

    def sense(self, x, noise_scale=1.):
        return x[0] + randn()*noise_scale

    def run(self, count=50):
        np.random.seed(124)
        obj = ConstantVelocityObject()
        
        xs, zs = [], []
        for i in range(50):
            x = obj.update()
            z = self.sense(x)
            xs.append(x)
            zs.append(z)
        return xs,zs

class ConstantAccelerationObject(object):
    R, Q = 6., 0.02

    def __init__(self, x0=0, vel=1., acc=0.1, acc_noise=.1):
        self.x = x0
        self.vel = vel
        self.acc = acc
        self.acc_noise_scale = acc_noise
    
    def update(self):
        self.acc += randn() * self.acc_noise_scale       
        self.vel += self.acc
        self.x += self.vel
        return (self.x, self.vel, self.acc)
  
    def sense(self, x, noise_scale=1.):
        return x[0] + randn()*noise_scale
    
    

class Chapter08_all(object):
    
    
   
    def __init__(self):
        pass
    
    def ZeroOrderKF(self, R, Q, P=20):
        """ Create zero order Kalman filter.
        Specify R and Q as floats."""
        kf = KalmanFilter(dim_x=1, dim_z=1)
        kf.x = np.array([0.])
        kf.R *= R
        kf.Q *= Q
        kf.P *= P
        kf.F = np.eye(1)
        kf.H = np.eye(1)
        return kf
    
    def FirstOrderKF(self, R, Q, dt):
        """ Create first order Kalman filter. 
        Specify R and Q as floats."""
        kf = KalmanFilter(dim_x=2, dim_z=1)
        kf.x = np.zeros(2)
        kf.P *= np.array([[100, 0], [0, 1]])
        kf.R *= R
        kf.Q = Q_discrete_white_noise(2, dt, Q)
        kf.F = np.array([[1., dt],
                         [0., 1]])
        kf.H = np.array([[1., 0]])
        return kf
    
    
    def SecondOrderKF(self, R_std, Q, dt, P=100):
        """ Create second order Kalman filter. 
        Specify R and Q as floats."""
        kf = KalmanFilter(dim_x=3, dim_z=1)
        kf.x = np.zeros(3)
        kf.P[0, 0] = P
        kf.P[1, 1] = 1
        kf.P[2, 2] = 1
        kf.R *= R_std**2
        kf.Q = Q_discrete_white_noise(3, dt, Q)
        kf.F = np.array([[1., dt, .5*dt*dt],
                         [0., 1.,       dt],
                         [0., 0.,       1.]])
        kf.H = np.array([[1., 0., 0.]])
        return kf
    
    
    def simulate_acc_system(self, R, Q, count):
        obj = ConstantAccelerationObject(acc_noise=Q)
        zs = []
        xs = []
        for i in range(count):
            x = obj.update()
            z = obj.sense(x, R)
            xs.append(x)
            zs.append(z)
        return np.asarray(xs), zs    
    
    def simulate_system(self, Q, count):
        obj = ConstantVelocityObject(x0=.0, vel=0.5, noise_scale=Q)
        xs, zs = [], []
        for i in range(count):
            x = obj.update()
            z = obj.sense(x)
            xs.append(x)
            zs.append(z)
        return np.asarray(xs), np.asarray(zs)
    
    
    def filter_data(self, kf, zs):
        xs, ps = [], []
        for z in zs:
            kf.predict()
            kf.update(z)
    
            xs.append(kf.x)
            ps.append(kf.P.diagonal()) # just save variances
        
        return np.asarray(xs), np.asarray(ps)
    
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

    def NEES(self, xs, est_xs, ps):
        est_err = xs - est_xs
        err = []
        for x, p in zip(est_err, ps):
            err.append(np.dot(x.T, inv(p)).dot(x))
        return err
        
    
    
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
        R, Q = 6., 0.02
        xs, zs = self.simulate_acc_system(R=R, Q=Q, count=80)
        kf2 = self.SecondOrderKF(R, Q, dt=1)
        est_xs, ps, _, _ = kf2.batch_filter(zs)
        
        nees = self.NEES (xs, est_xs, ps)
        eps = np.mean(nees)
        
        print('mean NEES is: ', eps)
        if eps < kf2.dim_x:
            print('passed')
        else:
            print('failed')
def main():
    ch = Chapter08_all()
    ch.start()
    

if __name__ == "__main__": main()

