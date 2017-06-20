import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize

class Chapter02_14(object):
    

    belief = np.array([.35, .1, .2, .3, 0, 0, 0, 0, 0, .05])
    
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
        for i in range(30):
            self.belief = self.perfect_predict(self.belief, 1)
            drawnow(self.draw_fig, show_once=False, confirm=False)
            time.sleep(0.05)


def main():
    ch = Chapter02_14()
    ch.run()
    

if __name__ == "__main__": main()

