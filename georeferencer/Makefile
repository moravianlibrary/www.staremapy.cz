PROJS = umisti imagesearch

all: compile

compile:
	for PROJ in $(PROJS) ; do \
		$(MAKE) -C $$PROJ compile; \
	done

clean:
	for PROJ in $(PROJS) ; do \
		$(MAKE) -C $$PROJ clean; \
	done
