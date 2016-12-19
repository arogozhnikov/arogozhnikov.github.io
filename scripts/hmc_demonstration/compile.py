import os

dir_path = os.path.dirname(os.path.realpath(__file__))
files = os.listdir(dir_path)

for filename in files:
    lower_filename = str.lower(filename)
    if lower_filename[-3:] == '.js' and ('compiled' not in lower_filename):
        print filename
        name = os.path.join(dir_path, filename[:-3])
        # transform-regenerator for yield API
        os.system('babel --plugins transform-regenerator {name}.js --out-file {name}-compiled.js --source-maps'.format(name=name))
