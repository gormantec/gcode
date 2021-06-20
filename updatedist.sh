
echo "test"
cwd=$(pwd)
echo $cwd
cd dist
echo "{ \"files\":{" > tsfiles.json
find . | grep -v node_modules/ | grep "\.ts" | while read -r line ; do
    echo "  \"$(node ../scripts/md5.js /dist${line:1})\":\"/dist${line:1}\"," >> tsfiles.json
    # your code goes here
done
sed -i '' '$ s/.$//' tsfiles.json
echo "}}" >> tsfiles.json
cd ${cwd}


