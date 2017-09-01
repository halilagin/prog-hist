import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;

belief = np.array([1./3, 1./3, 0, 0, 0, 0, 0, 0, 1/3, 0])
print (belief)

hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
belief = hallway * (1./3)

plt.figure()
bp.bar_plot(belief).show()
