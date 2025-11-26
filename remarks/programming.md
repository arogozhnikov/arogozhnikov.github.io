---
layout: post
title: "Remarks"

date: "2021-01-01"
author: Alex Rogozhnikov
tags:
- remarks

---

<link rel="stylesheet" href="{{ "/css/remarks.css" | prepend: site.baseurl }}">


<!---
<details class="post" markdown="1">
<summary markdown="1">
## Programming principles
</summary>
Conrrtwere
</details>
-->



## Programming foundations

Short summary of most general ideas or observations in programming. <br />
Based on observations and the evolution of programming.


## General


- naming is important. Names communicate to machine, to other, to your future self. 

  Names are the first thing imprinted in the head, names are used during search and navigation, names are used in documentation to refer to code.
  
  Perfect naming scheme is unknown, though it would be great to have a pseudo-algorithm to come up with names.
  
  Start from long descriptive names, later refine to most precise ones.
  
  There are many things that do not need names (e.g. intermediate variables that are not reused, lambdas that are used only once).
  
- *efficient* caches are hard, rumors are not lying

- co-locality of things should be first determined by "which things will need simultaneous change"
  
  It was long though that documentation of the project should be separated from project itself &mdash; e.g. `man {command}`, not `{command} --help`.
  Some languages separate header (declaration) from implementation into separate file, not that common anymore.
  Same with documentation of modules and functions &mdash; documentation was a while ago kept separately, not generated from sources.
  Yet another example is test suites &mdash; previously those were not aligned with code.
  
  Co-locality is not necessarily the same file, it can be a mirrored file, but there should be clear connection between entities. Mapping better be programmable.

- repeating yourself is *not* a sin, *if this is verified by compiler/CI/other automation*.

  ```python 
  send_message(phone_number=number)
  ```
  even though there is one argument, and code *repeats* part of function signature, it is more reliable if function signature is about to change.
  
- Decomposition. If you search for the one most successful idea of programming, this is decomposition.

  We are arguing a lot about what are *units* of decomposition, how those should be represented or written, how interaction should be organized between subunits.
  
  But decomposition is always there.
  
- Programming fails when decomposition fails. 

  "Detect a pedestrian on the image" does not decompose into "find a left leg", "find a right let", etc. <br />
  "Recognize what is said" does not decompose into "parse the first/second/third symbol of a phrase". <br />
  "Properly format/parse this table" does not decompose into "find first cell, parse, format" etc, etc. 
  
  High-performance programming also suffers when decomposition should be sacrificed for performance optimizations.

- automation. Second most valuable thing. Automate everything from typo checks to testing, deployment, migrations, user-testing and staging.

  Key here is not reducing human efforts, but glue-ing people. Large teams just can't work without good process automation.
  
  Large open-source collaborations similarly can exist only with good process support.

- proper coding practice and environment allow working in 'mostly reactive' mode. Environment *suggests and points*, you *react*.

  "Oh yes, I've forgotten to update two more places, and this thing is unused, right." <br />
  "Need to improve test coverage here, this part not tested at all."<br />
  "This deprecation warning is helpful, we should fix it".<br />
  "CI failed after this change, so ...".<br />

- get code versioning, any; get style, any.

  People tend to argue over any component that is "choosable" and "discussable". <br />
  Typically, if there is a strong advantage of one of options, it becomes clear very soon. <br />
  As a result, most arguing focuses on things that matter less.

- Observationally, text is the best representation for code than any other form (e.g. diagrams, controlled 'lego' constructs).
  
  Domination of text is that strong that programming and coding are interchangeable.

- convenience for reading != convenience for writing

  Underestimated idea is "augmented" code. At some point (early Fortran) there was no difference between capital and non-capital letters. <br />
  Then we learnt to use capitalization and underscores to communicate more information. Then syntax highlighting appeared and became de-facto standard. <br />
  Existing code editors contain a lot of graphical information (did this line change? different kinds of errors, highlight of selected entity, strike-through for deprecations, and a myriad of other subtle things). <br />
  This direction was very fruitful, and still not completely explored.

- limit novelty to what is actually novel

  it is tempting to use novel resource dispatching mechanism or introduce better build procedure for the application,
  or interface system. Very few projects managed to survive after spreading efforts over multiple layers of stack.
  
  Within a big project it is still mostly building level-by-level, 
  it is hard to design several layers simultaneously (unless you had experience with them).

- data is precious
  
  Take for granted that data should never be lost or irreversibly corrupted.
  
- "if you do it, do it right". Explicitly fail if not sure, that provided inputs can be handled

  This principle is a direct consequence of growing complexity. 
  When a solution is decomposed into thousands of components, each one has to complete its part perfectly.
  One percent of mistake (tolerable for humans doing complex tasks) is not acceptable in this setup.
  
  Explicit failure/warning allows one to focus on the right part in searches.
  
- The best assumptions are those that can be checked automatically (e.g. types in compiler, statis checks, dynamic checks).

  Each component (function, method, object, module, API, ...) has a lot of assumptions that make particular problems solvable.
  
  In modern terms: which file is where, what are input arguments, and their types, agreement between arguments, availability of connections, 
  API version, packages, ability to run on GPU, amount of available space, need specific type of text input, support of specific fonts required,   etc. 

- Avoid or minimize implicit assumptions. Make them explicit (and correct &mdash; better auto-checkable).
  
- Do not expect that final user of your code is aware about existence of your code, even when user is a coder.

  Expect that your code is used by another wrapping component, which is used in another component, which...
  
  E.g. openblas > numpy > xarray > application level package. 
  
  Strange consequence is that the best software is the software that is used, but you never hear about it.


## API, design, communication


- space in the head is limited. There are not-so-many things we can keep in the head, there are even fewer that we can efficiently operate with simultaneously.

- it should be easier to make safe, than non-safe. Safety enforced by default and user should explicitly ask for switching checks off.

  ```python
  delete_folder(delete_if_hardlink=True) # fails if flag not provided
  searchsorted(a, b, do_not_check_that_a_is_sorted=True)
  install(this_is_proprietary_software=True, yes_i_have_read_license_agreement=True, today='2012/06/02')
  ```

- there should be documentation, yet do not assume users will read it.

  One has to deal with dozens of APIs, and experienced API designer is aware of it.
  There are very few dependencies that one will actually study in detail.
  Most common scenarios should be presented first, arguments should have undoubtful meaning.
  "Call that function first, then this" or "it is assumed that you've initialized X" are things that require reading the documentation. 
  Arguments that are hard to communicate, should cause confusion and guide user to documentation.
  
- Right abstractions/entities are a large part of success.

  Internal abstractions and abstractions that are available in API may be quite different.
  
  Number of abstractions that user should deal with (i.e. those in API), should be limited; better if user already knows those. 

- Very beneficial when system can globally take care of some aspects. <br /> 
  On the opposite side, this makes interaction between systems harder.

  Python/Ruby/.net take care of memory management / types / access control. <br />
  Rust has a concept of ownership.<br />
  Go can do concurrency management with goroutines.<br />
  
  But concept of ownership can't propagate through non-rust code.<br />
  And garbace collection won't help for rust insertions.<br />
  Concurrency management in one system won't make friends with similar in other languages.


## Other

  
- Adoption ladder: use-case, then API, then community support. <br />
  Even the best API is unlikely to bring success if there is no clear case which is not addressed by existing systems. <br />
  There are multiple examples of opposite (success of poorly designed APIs).

- Education in programming focuses on "how to make a thing that works while your hands are not on the keyboard". <br />
  More valuable goal is "system that can be adjusted for tomorrow needs and be continuously modified without interruptions, allow multiple users and maintains sufficient reliability".

- Migration from simplest to hardest: refactor code, change entities, refactor API, migrate data, migrate users.

- Price of error, we constantly compare prices of different errors.

- It is hard to automate an area where no automation was assumed in the first place.

- Tests can be randomized, and sometimes they should be. They only need to be reproducible.

## Dependency management

- after several experiments I came to conclusion that explicit (manual) management of dependencies is the best; 
  in this scenario developer documents current and potential (direct) dependencies, and describes why specific version is chosen. 

- it requires time and exposure to "environment" - what to expect from each package and its maintainers, but that turns out to be beneficial


## Environment 

- efficient, convenient environment is critical

- multiple environments introduce perceptual overhead, 
  specially if tools are tuned similarly, 
  or if there are similar-but-slightly different version of the same library/functionality.   

