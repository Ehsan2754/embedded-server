#!/bin/bash

# Paths
STATIC_PATH=static/;
HTML_PATH="${STATIC_PATH}index.html";
TARGET=Inc/web.h;

# Preservations for the header file
PREFIX="const char PAGE_MAIN[] PROGMEM = R\"=====(
    
    "

SUFFIX="



)=====\";";
HTML_SRC=`cat ${HTML_PATH}`
echo "${PREFIX} ${HTML_SRC} ${SUFFIX}" > ${TARGET};
