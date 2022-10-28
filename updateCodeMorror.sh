wget https://codemirror.net/5/codemirror.zip
unzip codemirror.zip
cd codemirror-5.*
cp -rf lib/* ../lib
cp -rf mode/* ../mode
cp -rf addon/* ../addon
cp -rf keymap/* ../keymap
cp -rf theme/* ../theme
cd ..
rm -rf codemirror-5.*
rm codemirror.zip