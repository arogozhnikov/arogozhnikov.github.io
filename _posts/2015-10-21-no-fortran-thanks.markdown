---
layout: post
title:  "No, fortran, thanks"
date: 2015-10-15 12:00:00
author: Alex Rogozhnikov
tags: 
- writing classifier
- Machine learning
- Python
---

I have scanned many sources (~20 books and dozens of web pages). Hard luck I missed something really important. The question I posted is indeed incorrect and comes from my initial high expectation about array operations in fortran. 

The answer I would expect is: there are no tools to write short, readable code in fortran with automatic parallelization (to be more precise: there are, but those are proprietary libraries).

The list of intrinsic functions available in fortran is quite short
([link](https://www.nsc.liu.se/~boein/f77to90/a5.html#section3)), and consists only of functions easily mapped to SIMD ops.

There are lots of functions that one will be missing. 

* while this could be resolved by separate library with separate   implementation for each platform, fortran doesn't provide such. 
  There are commercial options (see [this thread](https://software.intel.com/en-us/forums/intel-visual-fortran-compiler-for-windows/topic/297520))


Brief examples of missing functions:

* no built-in array `sort` or `unique`. The proposed way is to use [this library](http://www.fortran-2000.com/rank/), which provides single-threaded code (forget threads and CUDA)

* cumulative sum / running sum. One trivially can implement it, but the resulting code will never work fine on threads/CUDA/Xeon Phi/whatever comes next.

* bincount, numpy.ufunc.at, numpy.ufunc.reduceat (which is very useful in many applications)

In most cases fortran provides 2x speed up even with simple implementations, but the code written will always be one-threaded, while matlab/numpy functions can be reimplemented for GPU or other parallel platform (which occasionally happened to MATLAB, also see gnumpy, [theano](https://github.com/Theano/Theano) and [parakeet](http://parakeetpython.com))

To conclude, this is bad news for me. Fortran developers really care about having fast programs today, not in the future. I also can't lock my code on proprietary software. And I'm still looking for appropriate tool. ([Julia](http://julialang.org/) is current candidate)


See also:

* [STL analogue in fortran](http://stackoverflow.com/questions/24979199/stl-analogue-in-fortran)
where ready-to-use algorithms are asked.

* [Numerical recipes: the art of parallel programming](http://www.elch.chem.msu.ru/tch/group/FortranBooks/NumericalRecipesinF90.pdf) author implements basic MATLAB-like operations to have more expressive code

* I also find useful [these notes](http://people.cs.vt.edu/~asandu/Deposit/Fortran95_notes.pdf) to see recommended ways of code optimizations (to see there is no place for vector operations)

* [numpy, fortran, blitz++: a case study](http://www.hindawi.com/journals/sp/2014/870146/abs/)

* [dicussion](https://software.intel.com/en-us/forums/intel-visual-fortran-compiler-for-windows/topic/297520) about implementing unique in fortran, where proprietary tools are recommended.