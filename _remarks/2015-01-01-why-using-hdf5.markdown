---
layout: post
title: Why using HDF5?
date: '2015-01-01T11:44:00.000-08:00'
author: Alex Rogozhnikov
tags:
- Machine Learning
- Optimization
modified_time: '2015-01-02T12:43:26.234-08:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-2272022213403979655
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/01/why-using-hdf5.html
---

**Update**: Everything below is inessential since I found the [StackOverflow](http://stackoverflow.com/a/27713489/498892) answer about HDF5.

The only thing I don't agree with is Blaze. I've tried it, and it’s clearly still in a raw state and needs a lot of time to become not just stable but truly useful.

---

My current workflow is entirely based on IPython, and I work extensively with Pandas (which, in my opinion, is an example of poor library design).

Recently, I transitioned to using HDF. However, installing PyTables (which is required to use HDF with Pandas) wasn’t as straightforward as I expected.

Now, I convert all my data to HDF.

- First, this often reduces the space needed to store data by about 2-3 times (though this depends on the dataset; for some, there’s no difference between CSV and HDF).
- Second, the data is stored in a binary format, so all types are strictly defined – no parsing or type guessing is necessary.
- This makes read/write operations significantly faster (by orders of magnitude).
- Additionally, no approximations are made for float numbers.

I hope these are enough reasons to consider switching to HDF.
