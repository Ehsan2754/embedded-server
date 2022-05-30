#!/bin/bash

# Paths
STATIC_PATH=web/static/;
HTML_PATH="${STATIC_PATH}index.html";
TARGET=core/web.h;

# Preservations for the header file
PREFIX="#ifndef WEB_H
#define WEB_H
const char PAGE_MAIN[] PROGMEM = R\"=====(
    
    "

SUFFIX="



)=====\";
#endif //WEB_H
";
HTML_SRC=`cat ${HTML_PATH}`
echo "${PREFIX} ${HTML_SRC} ${SUFFIX}" > ${TARGET};
echo "Web header generated!        TARGET=${TARGET}";