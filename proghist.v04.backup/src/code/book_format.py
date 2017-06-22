# -*- coding: utf-8 -*-

"""Copyright 2015 Roger R Labbe Jr.


Code supporting the book

Kalman and Bayesian Filters in Python
https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python


This is licensed under an MIT license. See the LICENSE.txt file
for more information.
"""

from __future__ import (absolute_import, division, print_function,
                        unicode_literals)

from contextlib import contextmanager
from distutils.version import LooseVersion
import json
import matplotlib
import matplotlib.pylab as pylab
import matplotlib.pyplot as plt
import numpy as np
import os.path
import sys
import warnings


# version 1.4.3 of matplotlib has a bug that makes
# it issue a spurious warning on every plot that
# clutters the notebook output
if matplotlib.__version__ == '1.4.3':
    warnings.simplefilter(action="ignore", category=FutureWarning)

np.set_printoptions(precision=3)

def test_filterpy_version():

    import filterpy
    from distutils.version import LooseVersion

    v = filterpy.__version__
    min_version = "0.1.2"
    if LooseVersion(v) < LooseVersion(min_version):
       raise Exception("Minimum FilterPy version supported is {}.\n"
                       "Please install a more recent version.\n"
                       "   ex: pip install filterpy --upgrade".format(
             min_version))


# ensure that we have the correct filterpy loaded. This is
# called when this module is imported at the top of each book
# chapter so the reader can see that they need to update FilterPy.
test_filterpy_version()

pylab.rcParams['figure.max_open_warning'] = 50



def equal_axis():
    pylab.rcParams['figure.figsize'] = 10,10
    plt.axis('equal')


def reset_axis():
    pylab.rcParams['figure.figsize'] = 9, 3

def set_figsize(x=9, y=4):
    pylab.rcParams['figure.figsize'] = x, y


@contextmanager
def figsize(x=9, y=4):
    """Temporarily set the figure size using 'with figsize(a,b):'"""

    size = pylab.rcParams['figure.figsize']
    set_figsize(x, y)
    yield
    pylab.rcParams['figure.figsize'] = size


@contextmanager
def numpy_precision(precision):
	old = np.get_printoptions()['precision']
	np.set_printoptions(precision=precision)
	yield
	np.set_printoptions(old)

@contextmanager
def printoptions(*args, **kwargs):
    original = np.get_printoptions()
    np.set_printoptions(*args, **kwargs)
    yield
    np.set_printoptions(**original)



