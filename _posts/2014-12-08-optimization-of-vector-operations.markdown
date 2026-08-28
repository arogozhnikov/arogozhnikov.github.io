---
layout: post
title: Optimization of vector operations with bit hacks
date: '2014-12-07T13:46:00.001-08:00'
author: Alex Rogozhnikov
tags:
- vectorization
- Python
- numpy
modified_time: '2014-12-07T13:50:31.814-08:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-8224856403945810380
blogger_orig_url: http://brilliantlywrong.blogspot.com/2014/12/optimization-of-vector-operations.html
---

Recently worked on optimization of some (internal) classifier. The problem was mostly not in training, but in applying of trained classifier — this code was originally written in C++ and then translated to cython (which surprisingly decreased the speed by a factor of 2).

This was quite easy rewrite the code using numpy and vectorized approach (initially predictions were built event-by event, after rewriting the classifier was applied tree-by-tree). However this gave only speed comparable with original C++ code (and twice faster than cython version).

What really fastened the code is switching from int8 operations to int64 (the latest are natively supported in all modern processors). So 8 operations in int8 were grouped into one 64-bit operation.

This is pretty simple to perform by creating views:

```
In[1]: import numpy
In[2]: x = numpy.random.randint(0, 100, size=64000).astype(’int8′)
In[3]: y = numpy.random.randint(0, 100, size=64000).astype(’int8′)
In[4]: %timeit x & y
10000 loops, best of 3: 60.6 µs per loop
In[5]: %timeit x.view(’int64′) & y.view(’int64′)
100000 loops, best of 3: 12 µs per loop
# Checked that output is correct
In[6]: numpy.all( (x & y) == (x.view(’int64′) & y.view(’int64’)).view(’int8′) )
Out[6]: True
```

In this simple example we see 5x speed up. Views of course do not copy the data, which is very essential for the speed. This trick can be applied with: summation / subtraction / binary or / binary and, but you need that the size of original array was divisible by 8.

### Links

1. there is an awesome collection of [twiddling bits](https://graphics.stanford.edu/~seander/bithacks.html), which was my starting point in bit optimizations.
2. For more about numpy see numpy tips and tricks, see [part1]({% post_url 2015-09-29-NumpyTipsAndTricks1 %}) and [part2]({% post_url 2015-09-30-NumpyTipsAndTricks2 %}).
