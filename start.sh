docker run -it --rm --label=jekyll --volume=`pwd`:/srv/jekyll  -it -p 4000:4000 jekyll/jekyll bash
# jekyll serve --incremental