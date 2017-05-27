import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize

class Chapter02_15(object):
    

    belief = np.array([0, 0, 0, 1., 0, 0, 0, 0, 0, 0])
    
    def predict_move(self, move, left, X, right):
        n = len(self.belief)
        prior = np.zeros(n)
        for i in range(n):
            prior[i] =  self.belief[(i-move+1)%n] * left + self.belief[(i-move)%n] *X + self.belief[(i-move-1)%n] * right;
        return prior
    
    def perfect_predict(self,belief, move):
        n = len(belief)
        result = np.zeros(n)
        for i in range(n):
            result[i] = belief[(i-move)%n]
        return result
    
    def draw_fig(self):
        bp.bar_plot(self.belief)
        #show()
    
    def run(self):
        for i in range(100):
            drawnow(self.draw_fig, show_once=False, confirm=False)
            self.belief = self.predict_move(1, 0.1, 0.8, 0.1)
            time.sleep(0.2)
            drawnow(self.draw_fig, show_once=False, confirm=False)
        
        


def main():
    ch = Chapter02_15()
    ch.run()
    

if __name__ == "__main__": main()

