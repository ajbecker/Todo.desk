import shutil
import os
import datetime
from subprocess import call

debug = True


# Get all the paths we care about
cwd = os.getcwd()
jsdir = os.path.join(cwd, "js")
cssdir = os.path.join(cwd, "css")
resdir = os.path.join(cwd, "res")
output = os.path.join(cwd, "output")
outjsdir = os.path.join(output, "js")
outcssdir = os.path.join(output, "css")
outresdir = os.path.join(output, "res")

nodebin = os.path.join(cwd, "node_modules", ".bin")
lessbin = os.path.join(nodebin, "lessc.cmd")
handlebarbin = os.path.join(nodebin, "handlebars.cmd")
uglifybin = os.path.join(nodebin, "uglifyjs.cmd")
npmbin = "npm.cmd"

# CLean the old stuff.
if os.path.exists(output):
    print "cleaning old output"
    shutil.rmtree(output)

# Build the output
print "building output"
os.mkdir(output)
os.mkdir(outjsdir)
os.mkdir(outcssdir)
os.mkdir(outresdir)

# If we don't have the npm modules installed yet then install them.
if os.path.exists(lessbin) is False or os.path.exists(uglifybin) is False or os.path.exists(handlebarbin) is False:
    print "Updating node packages"
    call([npmbin, "update"])

# Copy the cache.manifest file over.
# shutil.copy(os.path.join(cwd, "cache.manifest"), output)
# print "Copying manifest file and appending timestamp"
# with open(os.path.join(output, "cache.manifest"), "a") as manifest:
#     manifest.write("# Manifest Timestamp: " + str(datetime.datetime.now()))

# Copy the files over.
files = os.listdir(cwd)
for file in files:
    filename = os.path.join(cwd, file)
    if os.path.isfile(filename) and filename.endswith(".html"):
        print "copying file: ", file
        shutil.copy(filename, output)

# Copy the resources over.
files = os.listdir(resdir)
for file in files:
    filename = os.path.join(resdir, file)
    if os.path.isfile(filename):
        print "copying file: ", file
        shutil.copy(filename, outresdir)

# Copy the javascript files to the output.
files = os.listdir(jsdir)
for file in files:
    filename = os.path.join(jsdir, file)
    if os.path.isfile(filename) and filename.endswith(".js"):
        if filename.endswith(".min.js") or debug:
            print "copying file: ", file
            shutil.copy(filename, outjsdir)
        else:
            print "minimizing file: ", file
            outfile = os.path.join(outjsdir, file)
            call([uglifybin, filename, "-o", outfile])

# Copy the css files to the output.
files = os.listdir(cssdir)
for file in files:
    filename = os.path.join(cssdir, file)
    if os.path.isfile(filename) and filename.endswith(".less"):
        print "compiling file: ", file
        outfile = file.replace(".less", ".css")
        outfile = os.path.join(outcssdir, outfile)
        call([lessbin, "-x", filename, outfile])

# Compile the templates.
print "Compiling templates.js"
if debug:
    call([handlebarbin, os.path.join(jsdir, "templates"), "-f", os.path.join(outjsdir, "templates.js")])
else:
    call([handlebarbin, "-m", os.path.join(jsdir, "templates"), "-f", os.path.join(outjsdir, "templates.js")])
