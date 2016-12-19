import os

dir_path = os.path.dirname(os.path.realpath(__file__))
files = os.listdir(dir_path)

for filename in files:
    filename = str.lower(filename)
    if filename[-3:] == '.js' and ('compiled' not in filename):
        print filename
        name = os.path.join(dir_path, filename[:-3])
        os.system('babel {name}.js --out-file {name}-compiled.js --source-maps'.format(name=name))

