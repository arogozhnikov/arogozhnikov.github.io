sudo docker run --rm --label=jekyll --volume=$(pwd):/srv/jekyll  -it -p 4000:4000 jekyll/jekyll jekyll serve
