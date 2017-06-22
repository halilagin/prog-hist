import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
from filterpy.discrete_bayes import normalize



def perfect_predict(belief, move):
    n = len(belief)
    result = np.zeros(n)
    for i in range(n):
        result[i] = belief[(i-move)%n]
    return result
    
plt.figure(1)
belief = np.array([.35, .1, .2, .3, 0, 0, 0, 0, 0, .05])
plt.subplot(121)
bp.bar_plot(belief, ylim=(0,.4))

newBelief = perfect_predict(belief, 1)
plt.subplot(122)
bp.bar_plot(newBelief, ylim=(0,.4))

plt.show()


