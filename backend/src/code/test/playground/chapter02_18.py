import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize
from filterpy.discrete_bayes import predict

class Chapter02_18(object):
    

    belief = np.array([.05, .05, .05, .05, .55, .05, .05, .05, .05, .05])
    
    def predict_move_conv(self, pdf, offset, kernel):
        n = len(pdf)
        kN = len(kernel)
        width = int((kN-1)/2)
        prior = np.zeros(n)
        for i in range(n):
            for k in range(kN):
                pdfIdx = ( i + width - k - offset ) % n
                prior[i] = kernel[k] * pdf[ pdfIdx ]
        return normalize(prior)
    
    
    def draw_fig(self):
        bp.bar_plot(self.belief, ylim=(0,0.6))
        #show()
    
    def run(self):
        print(self.belief)
        drawnow(self.draw_fig, show_once=False, confirm=False)
        time.sleep(2)
        self.belief = self.predict_move_conv(self.belief, offset=0, kernel=[0.1,0.8,0.1])
        drawnow(self.draw_fig, show_once=False, confirm=False)
        print(self.belief)
        time.sleep(2)
        self.belief = predict(self.belief, offset=1, kernel=[.1, .8, .1])
        drawnow(self.draw_fig, show_once=False, confirm=False)

        
            
        


def main():
    ch = Chapter02_18()
    ch.run()
    

if __name__ == "__main__": main()

