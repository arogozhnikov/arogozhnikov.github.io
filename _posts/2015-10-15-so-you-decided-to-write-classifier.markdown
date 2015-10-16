---
layout: post
title:  "So you decided to write classifier (bad advice)"
date: 2015-10-15 12:00:00
author: Alex Rogozhnikov
tags: 
- writing classifier
- Machine learning
- Python
---

So, you decided to write brand new library of machine learning. 
This one will be much better than everything you have seen before. 
It will be fast, easy-to-use, even-easier-to-extend, flexible, with support of multi-core computations and many more.
 
There are traditions which most of developers of ML libraries are trying to follow and I decided to collect them together.

Most of the experience came from developing [yandex/REP](https://github.com/yandex/rep) and browsing code / experimenting with 
different classifiers.

Treat this as 'awful advice collection'. 

<img src='/images/etc/bad_advice.jpg' style='margin: 20px 100px; width: 400px;' alt='bad advice ahead' />

0. __Your library is the start and end point in research.__ 
   That's the key point in doing all bad. There is nothing else user should pay attention to. 
   All the rest is consequence of this simple rule.

1. __Never care about whether other libraries exist.__
   Why actually you shall remember there are other libraries of machine learning and how many of them are already on the market?
   Definitely, the one written by you will be times better.
   Speed benchmarks? Forget. New algorithms? No, never. Building tests to compare accuracy on public data is also nothing but senselessly spent time. 

2. __Invent new interface.__ The more entities - the better.
   User expects the usage to be simple? Bad idea. You know OOP!
   
   Special class trainer. Special class dataset. Also you need class supervised dataset.
   And special class for sampling from supervised dataset. 
   
   You'll never implement one more sampler, but this is definitely needed for the sake of OOP.

3. __Use your own format.__ Any successful library has it's own format.
   Currently used formats are not universal. We need a new one.
   Binary formats (like HDF5, FITS and ROOT) are definitely bad.   
     
   It's better to introduce a new one. Like csv, but with custom separator.
   Also, you will not add column names there, since algorithm doesn't require it. 
   
   Meta-information needed for you algorithm can be added as special file together with simple csv? 
   Anyway, you need a new file.
       
   <!-- LibFFM, VowpalWabbit --->

4. __Don't use random seed.__ At least don't do it like users expect. There are options:

   1. never set seed. If algorithm didn't converge 10 times, that's all because of bad luck and random numbers. 
   2. set global random seed. Let reproducibility fail during multithreading
   3. finally, introduce parameter `random_seed` and ignore it. Haha!
     
   <!-- theanets, nolearn, pybrain, neurolab -->  


5. __Write in C++ or CUDA__. You heard there are other languages, but everyone knows that ML needs efficient implementations.
   Anything being written in C++ is the fastest possible.
   
   Don't use any vector language / tool. Code in C++ is very clear. Ignore parallel primitives. 
   
   Never use BLAS operations. Don't use numpy, theano, octave or fortran90+, otherwise other developers will be able to understand your code!
   
   <!-- PyBrain  --> 
   
   Also remember to create 'for efficient purposes' god-object and put all the data there.
   While reading your code, side programmer will not be able to get what information is used by each method.
   
   
6. __Write lots of logs to output!__.
   Remember that there is nothing else user shall remember of, but only about your library?
   
   Every step of algorithm shall print some useless information. Your algorithm can't be run silently.
   It should always return code 0 (whatever happens) ans print errors in stdout (not stderr!).
   
   Never use verbose parameter.
    
   <!-- LibFM as well as many nnets -->

7. There are definitely very few __libraries of neural networks and deep learning.__ 
   You'll write new and better one (though start from simple things, of course).
   
   Did I say you should ignore theano?

8. __SGD is a fresh idea!__ Adaptive SGD is even better. Online learning is the new mainstream. 
   That's the way to go. Learning representation? Use SGD! Logistic regression? SGD! Factorization? SGD! Using Rprop? SGD! 
   
   <!-- theanets -->

9. Write __your own map-reduce system.__ Optimization of algorithm is annoying process. 
   It's better to use 100 machines and solve the same problem faster, right?
    
   Everyone has a good cluster. Setting up distributed environment with same collection of libraries is very simple.
    
   Finally, there is always some user who wants 'distributed' option (but never will be able to us it for different reasons).  

   <!-- xgboost -->
 

10. Change interface all the time.  
    Drop the support as soon as someone starts using your library. 
    
    You'll find a new area to write your-next-best-open-library.
    
    <!-- theanets, keras, lasagne -->

Ok, I think it's enough. If I convinced you that there is no need in new libraries, but you still wish to do something useful in ML,
there are projects which you can help.

Firstly, those are:

* theano (looks there are ~3-4 active contributors)
* numpy (parallel operations in numpy are very needed there, as well as optimization of existing code)
* scikit-learn (which in some cases lacks multi-threading)

Even minor help to those projects is of more help, because lots of software relies on them.
Writing wrappers to projects you using is also useful.

If you still feel that you want to write a new library, spend much time with scikit-learn first.
Understand it's interface, how Bagging/AdaBoost work as meta-estimators. How grid-search for such meta-algorithms is done. 
Read the sources. 

Then start writing. Leave least dependencies and write simple code (using numpy or so). 
If it is required, you'll rewrite in more readable form. Make sure your library is installed via package manager (pip for python).  