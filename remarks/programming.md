## Programming principles


## General


- naming is important. Names communicate to machine, to other, to your future self. 

  Names are the first thing that will imprint in the head, names will be used during search, names will be used in documentation.
  Start from long descriptive names, later refine to most precise ones.
  
- efficient caches are hard, rumors are not lying

- co-locality of things should be first determined by "which things will need simulateneous change"
  
  It was long though that documentation of the project should be separated from project itself - e.g. man {command}, not {command} --help.
  Some languages separate header (declaration) from implementation into separate file.
  Same with documentation of modules and functions - documentation was kept separately.
  Another example is test suites.
 
  
  Co-locality is not necessarily the same file, it can be mirrored file, but there should be clear connection between entities, allowing to find one from the other.

- repeating yourself is not a sin, *if this is verified by compiler/CI/other automation*.

  ```python 
  call(phone_number=phobe_number)
  ```
  even though there is one argument, and clearly you repeat part of function signature, it improved reliability (what if function arguments changed?).

- proper coding practice and environment allow working in 'mostly reactive' mode. Environment suggests and points, you react.

  "Oh yes, I've forgot to update two more places, and this thing is unused, right."
  "Need to improve test coverage here, this part not tested at all."
  "This deprecation warning is helpful, we should fix it".
  "CI failed after this change, so ...".

- get code versioning, any; get style, any.

- convernienve for reading != convenience for writing

  Code that is readable is frequently much longer.
  
  

- limit novelty to what is actually novel

- data is precious

- if you do it, do it right. Explicitly fail if not sure that provided inputs can be handed

  This principle is a result of growing complexity of codebases. 
  When there are thousands of components, each one has to do exactly what is was created for.
  
  Explicit failure/warning allows one to focus on the right part.
  
- best assumptions are assumtions that are checked automatically (e.g. types in compiler, statis checks, dynamic checks).

- explicit is better than implicit. 

  Implicit assumptions are the worst.
  
- you should not expect that user of your code is aware about existence of your code.

  E.g. openblas > numpy > xarray > application level package.  


## API, design, communication


- space in the head is limited. There are not-so-many things we can keep in the head, there are even fewer that we can efficiently operate with simulatenously.

- it should be easier to make safe, than non-safe. Safety enforced by default and user should explicitly ask for switching checks off.

  ```python
  delete_folder(delete_if_hardlink=True) # fails if flag not provided
  searchsorted(a, b, do_not_check_that_a_is_sorted=True)
  install(this_is_proprietary_software=True, yes_i_have_read_license_agreement=True, today='2012/06/02')
  ```

- there should be documentation, yet it is not assumed users to read it.

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
