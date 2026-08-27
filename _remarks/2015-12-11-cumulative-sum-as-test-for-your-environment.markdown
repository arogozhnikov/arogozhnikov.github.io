---
layout: post
title:  "Cumulative sum as a test for your programming environment"
date: 2015-12-11 12:00:00
author: Alex Rogozhnikov
tags: 
- Optimization
- numpy
- fortran 
- parallel primitives
permalink: /2015/12/11/cumulative-sum-as-test-for-your-environment.html
---

This post may be useful for those researchers and programmers, who work much with numerical crunching. 

Have you ever tried to think about what coding will be like 10 years later?
What processors and technologies will be used?

Typically we don't care about such questions when writing our projects (unless those are a critical part of some important system).
Or we theorize in this direction, but this never affects our code.   

In principle, this is quite explainable: code written in C++ about 20-30 years ago is still working fine,
without many changes in its structure. The speed increased thanks to technological progress used in processors.

Processors and compilers changed much to increase execution speed, complex pipelines and automatic vectorization are 
used to make old-style programs run fast. 
 
But there is some __obvious limit your programming environment will not be able to overcome 
unless you explicitly take care of this__. I'll demonstrate it using a very trivial example &mdash; a cumulative sum.
   
The reference (abstract) code looks like: 
<pre>
  input = given array x of length n
  result = array of length n + 1
  result[0] = 0
  for i in 0, 1, .., n - 1:
      result[i + 1] = result[i] + input[i]
</pre>

Here I use zero-based indexing.
  
This is a fairly trivial piece of code that C/C++/Fortran programmers write in their language without any hesitation.
However, looking from the perspective of 10-years-later coding, this trivial code may 
become __the worst place in the program.__

To understand this, let's first look at changes in computing we can observe at this point. 
There were many talks over the years that possibilities of single core are exhausted 
(due to limitations of Si-based circuits), and we have to use many cores, or SIMDed processing units. 
Anyway, computers need to rely on parallel computations more and more.

But the code we wrote for cumulative sum is not parallelizable at all, the computations in cycle are chained, 
next iteration shall be done exactly after the previous one. Unless you use some dangerous flag like `-fmath`, the 
compiler will never be able (even in theory) to speed up this code, because otherwise it will have to break a summation order.

Summation order matters, because addition <a href='https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html'>is not associative</a>
in floating-point numbers.

## Ways to parallelize cumulative sum computation

There are different possible ways to make execution parallel, but this is not for free: the number 
of arithmetic operations will be at least doubled. Assume that we have $n$ samples and $m$ processing units, 
and that $n = m \times \text{chunk}$ (we can extend the initial array with zeros).

So each processing unit will work with a subarray of length $\text{chunk}$. 

<pre>
  n = m * chunk
  input = given array x of length n
  result = array of length n
  
  subarray_sums = array of length m
  for i in 0, 1, .., m - 1 in parallel:
      subarray_sums[i] = sum(result[i * chunk : (i + 1) * chunk])
       
  # Now we can compute 
  
  result[0] = 0
  for i in 0, 1, .., m - 1:
      result[(i + 1) * chunk] = result[i * chunk] + subarray_sums[i] 
      
  for i in 0, 1, .., m - 1 in parallel:
      for position in i * chunk, i * chunk + chunk - 1:
          result[position + 1] = result[position] + input[position] 
</pre>


## Numerical stability

An important question we have to keep in mind is that changing the order of computation may 
in theory lead to numerical instability (that's why even smart optimizers don't touch the computational graph), 
but in our case we reduced many unstable operations (adding a small number to a large one).
     
Now the computational flow consists of summing over a chunk, sequential summation of $m$ numbers of comparable order, 
and again summation within a chunk. This scheme is surely no worse than it was initially (a rare case, actually).
 

## Current optimal implementation

Maybe after several years our co-processors will consist of hundreds of cores and be present on every PC - who knows?

At this moment usually we have 2-4 cores in laptops, so there is no drastic difference, 
and probably not much sense in using more complex code unless you're going to use the code constantly.

The optimal implementation is available in `numpy` or `MATLAB`:
<pre>
result = cumsum(input)
</pre>

Eh... Trivial, right? This code is one-threaded (at this moment).

Why it's actually a good idea to use third-party functions is that their implementation may be changed according 
to the environment and situation. This is what already happened to many `MATLAB` operations.
 
People that were writing code in `MATLAB` 15 years ago had no idea what a GPU is. However, 
today many of their programs are enjoying <a href='https://www.mathworks.com/discovery/matlab-gpu.html'>GPU</a> acceleration. I.e. the GEMM operation is almost certainly run on a GPU today.

Contrary to this, fortran doesn't provide any convenient way to perform computation of cumsum.  

It would be funny to know years later that all the operations in your old code are parallelized, 
but the trivial loop for cumulative sum is still running in one thread, making the whole program slow.  


