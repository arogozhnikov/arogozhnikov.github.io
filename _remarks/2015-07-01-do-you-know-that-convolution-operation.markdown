---
layout: post
title: Do you know that convolution operation was implemented in deep learning systems
  via matrix multiplication?
date: 2015-07-01 12:00:00
author: Alex
tags:
- vectorization
- Optimization
modified_time: '2015-07-01T02:34:02.072-07:00'
thumbnail: http://3.bp.blogspot.com/-HIbKJEgqHq8/VZMKByieEKI/AAAAAAAAAFo/VSfvhGvpXUw/s72-c/im2col_corrected.png
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-3942318686173972749
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/06/do-you-know-that-convolution-operation.html
---


<img src="http://3.bp.blogspot.com/-HIbKJEgqHq8/VZMKByieEKI/AAAAAAAAAFo/VSfvhGvpXUw/s400/im2col_corrected.png" width="400" height="182" />


Here you can find a detailed description of how it is done by chunking the data

<http://petewarden.com/2015/04/20/why-gemm-is-at-the-heart-of-deep-learning/>

<br/>

Theano library, by the way, provides many possibilities for implementation of convolution, among which CPUCorrMM (this isn't the main way however)<br/>
<a href="http://deeplearning.net/software/theano/library/tensor/nnet/conv.html">http://deeplearning.net/software/theano/library/tensor/nnet/conv.html</a>

Today convolutions typically have small filters and implemented with <a href="https://blog.usejournal.com/understanding-winograd-fast-convolution-a75458744ff">Winograd optimization</a>
