#!/bin/bash

#After running, still requires adding post metadata to constants file, and routing
# to the app/posts routing modules
#Add the name of the post, if multiple words, separated by spaces within quotes
#USAGE: newPost.sh "hello world"
echo $1
script_dir=$(dirname "$0")
pushd $script_dir
echo $script_dir
skewer=$(echo "$1" | sed 's/ /-/g' )
firstLetterCap=$(echo $1 | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
pascalCase=$(echo "$firstLetterCap" | sed 's/ //g' )
underscore=$(echo "$1" | sed 's/ /_/g' )
constCase=$(echo "$underscore" |  tr '[:lower:]' '[:upper:]' )

mydir="${skewer}-post"

cp -r template-post $mydir
pushd $mydir
mv template.component.css "${mydir}.component.css"
mv template.component.html "${mydir}.component.html"
mv template.component.ts "${mydir}.component.ts"
tsfile="${mydir}.component.ts"

sed -i.bak "s/template/${skewer}/g" $tsfile && rm $tsfile.bak
sed -i.bak "s/TEMPLATE_POST/${constCase}/g" $tsfile && rm $tsfile.bak
sed -i.bak "s/Template/${pascalCase}/g" $tsfile && rm $tsfile.bak
popd

popd