import code.book_plots as bp
import numpy as np

# bp.plot_errorbars([(160, 8, 'A'), (170, 8, 'B')],
#                xlims=(145, 185), ylims=(-1, 1));


# bp.plot_errorbars([(160, 3, 'A'), (170, 9, 'B')],
#                    xlims=(145, 185), ylims=(-1, 1))

measurements = np.random.normal(165, 5, size=10000)
print('Average of measurements is {:.4f}'.format(
      measurements.mean()))