
echo "test"
cwd=$(pwd)
echo $cwd

for d in dist/*/ ; do
    echo "$d"
    cd ${cwd}/${d}
    find . | grep -v node_modules/ | grep "\.ts" > tsfiles.txt
done
cd ${cwd}
