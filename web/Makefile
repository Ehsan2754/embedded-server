# Paths
PATH:=static/
HTML_PATH:=${PATH}index.html
TARGET:=Inc/web.h

# Preservations for the header file
prefix="const char PAGE_MAIN[] PROGMEM = R\"=====(\n\n"

suffix="\n\n\n\n)=====\";"

# Loading sources
html_src=$(shell cat ${HTML_PATH})
# html_src=@cat ${HTML_PATH}
web_h="$(prefix)$(HTML_PATH)$(suffix)""

web:
	$(shell ./generate.sh)
	@echo "Web header generated!\tTARGET=${TARGET}"
clean:
	rm -f $(TARGET)