---
layout: post
title: "Machine Learning in Science and Industry slides"
excerpt: "Mini-course about machine learning given at GradDays of Heidelberg University"

date: "2021-01-01"
author: Alex Rogozhnikov
tags:
- remarks

---

<style>
li::marker {
    content: "— ";
    position: relative;
}
li>* {
    opacity: 0.1;
}

li>*:first-child{
    opacity: 1.0;
}

li:hover > * {
    opacity: 1.0;
}
li {
    /*max-height: 200px;*/
}
li:hover {
    max-height: 1000px;
}
</style>
## Programming principles


## General


- naming is important. Names communicate to machine, to other, to your future self. 

  Names are the first thing that will imprint in the head, names will be used during search and orienting, names are used in documentation to map to code.
  
  Start from long descriptive names, later refine to most precise ones.
  
  There are many things that do not need name at all (e.g. intermediate variables that are not reused).
  
- *efficient* caches are hard, rumors are not lying

- co-locality of things should be first determined by "which things will need simulateneous change"
  
  It was long though that documentation of the project should be separated from project itself - e.g. `man {command}`, not `{command} --help`.
  Some languages separate header (declaration) from implementation into separate file, not that common anymore.
  Same with documentation of modules and functions - documentation was a while age kept separately, not generated from sources.
  Another example is test suites - previously those were not aligned with code.
  
  Co-locality is not necessarily the same file, it can be a mirrored file, but there should be clear connection between entities, allowing to find one from the other. Mapping better be programmable.

- repeating yourself is *not* a sin, *if this is verified by compiler/CI/other automation*.

  ```python 
  send_message(phone_number=number)
  ```
  even though there is one argument, and clearly you repeat part of function signature, it is more reliable in case of changes in codebase.
  
- Decomposition. If you search for the one most successful idea of programming, this is decomposition.

  We are arguing a lot about what are units of decomposition, how those should be represented or written, how interaction should be organized between subunits.
  
  But decomposition is the key.
  
- Progamming fails when decomposition fails. 

  "Detect a pedestrian on the image" does not decompose into "find a left leg", "find a right let", etc.
  "Recognize what is said" does not decomposei into "parse the first symbol"
  "Properly format/parse this table" does not decompose into "find first cell, parse, format"
  etc, etc. 
  
  High-performance programming also suffers when decomposition should be sacrificed for performance optimizations.

- automation. Second most valuable thing. Automate everything from typo checks to testing, deployment, migrations, user-testing and staging.

  Key here is not reducing human efforts, but glueing them. Large teams just can't work without good process automation.
  
  Large open-source collaborations similarly can exist only with good process support.

- proper coding practice and environment allow working in 'mostly reactive' mode. Environment *suggests and points*, you *react*.

  "Oh yes, I've forgot to update two more places, and this thing is unused, right." <br />
  "Need to improve test coverage here, this part not tested at all."<br />
  "This deprecation warning is helpful, we should fix it".<br />
  "CI failed after this change, so ...".<br />

- get code versioning, any; get style, any.

  People tend to argue over any thing that is "choosable" and "discussable". 
  Typically, if there is a strong advantage of one of options, it becomes clear very soon.

- convenience for reading != convenience for writing

  Code that is readable is frequently much lengthier.
  
  Underestimated idea is "augmented" code. So far we only color code, underline and fold fragments, but going further that direction is valuable.

- limit novelty to what is actually novel

  it is tempting to use novel resource dispatching mechanism or introduce better build procedure for the application,
  or interface system. Very few projects managed to survive after spreading efforts over multiple layers.
  
  On a big project level it is still building level-by-level, it is hard to build several layers simultaneously.

- data is precious
  
  Better just take for granted that data should never be lost or irreversiby corrupted.
  
- "if you do it, do it right". Explicitly fail if not sure that provided inputs can be handed

  This principle is a direct consequence of growing complexity. 
  When a solution is decomposed into thousands of components, each one has to do prefectly what is was created for.
  One percent of mistake (tolerable for humans doing complex tasks) is not acceptable here.
  
  Explicit failure/warning allows one to focus on the right part in searches.
  
- best assumptions are assumtions that are checked automatically (e.g. types in compiler, statis checks, dynamic checks).

  Each component (function, method, object, module, API, ...) has a lot of assumptions that make particular problems solvable.
  
  In modern terms: which file is where, what are input arguments, and their types, agreement between arguments, availability of connections, 
  API version, packages, ability to run on GPU, amount of available space, need specific type of text input, support of specific fonts required,   etc. 

- Avoid implicit assumptions. Make them explicit, better auto-checkable.

  
- Do not expect that final user of your code is aware about existence of your code, even when user is a coder.

  From the very beginning, expect that your component is used by another wrapping component, which is used in another component.
  
  E.g. openblas > numpy > xarray > application level package. 
  
  Strange consequence is that the best software is the software that is used, but you never hear about it.
  
- it is an observation, but so far text is a by an astonishing margin better representation of code than any other form.


## API, design, communication


- space in the head is limited. There are not-so-many things we can keep in the head, there are even fewer that we can efficiently operate with simulatenously.

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
  Arguments that are hard to communicate, should cause confusion and direct user to documentation.
  
- Right abstractions/entities are a large part of success.

  There can be too many abstractions.

## Other

- Very benefitial when system can globally take care of some aspects. But this makes interaction between systems harder and harder.

  Python/Ruby/.net take care of memory management / types / access control.
  Rust has concept of ownership.
  Go can do concurrency management with goroutines.
  
  But concept of ownership can't propagate through non-rust code.
  And garbace collection won't help for rust insertions.
  Concurrency management in one system won't make friends with similar in other languages.
  
  
- Adoption: use-case, then API, then community support.

  Similar pattern observed in development to 

- Education focuses on "how to make thing that works while your hands are not on the keyboard".
  MOre appropriate goal is "system that can be adjusted for tommorrow needs and be continuosly modified without interruptions, allow multiple users and "

- Migration from simplest to hardest: refactor code, change entities, refactor API, migrate data, migrate users

- Price of error, we constantly manage prices of errors

- It is hard to automate an area where no autmation was assumed in the first place.

- Tests can be randomized, and sometimes should be. They only need to be reproducible.


<!---
- dependency management
- environments

--->
