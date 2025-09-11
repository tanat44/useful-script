#!/bin/sh

echo "+ hello"
echo

echo "+ create index.html"
echo "<h1>$(date)</h1>" > /volume/index.html
ls -la >> /volume/index.html
echo

echo "+ done"