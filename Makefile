BRANCH=$(shell git branch | grep '^*' | cut -d' ' -f2)

DYNAMIC_CONTENT=content/media/images/blog/2012/openstack-swift-storage.png
DYNAMIC_CONTENT+=content/media/images/blog/2012/openstack-swift-replication.png
DYNAMIC_CONTENT+=content/media/images/talks/CeilometerPlusHeatEqualsAlarming-OpenStackIcehouseSummit.png
DYNAMIC_CONTENT+=content/media/images/talks/ceilometer-to-telemetry.png
DYNAMIC_CONTENT+=content/media/images/talks/ceilometer-gnocchi.png
DYNAMIC_CONTENT+=content/media/images/talks/OpenStack-and-Debian.png
DYNAMIC_CONTENT+=content/media/images/talks/Ceilometer-presentation-OpenStack-France-meetup-\#2.png
DYNAMIC_CONTENT+=content/media/images/talks/Ceilometer-presentation-XLCloud.png
DYNAMIC_CONTENT+=content/media/images/talks/Ceilometer-presentation-ODS-Havana.png
DYNAMIC_CONTENT+=content/media/images/talks/Ceilometer-presentation-FOSDEM-2013.png

deploy: site.yaml clean $(DYNAMIC_CONTENT)
	hyde gen

pub: deploy
	if [ "$(BRANCH)" = "master" ]; then \
		if ! git status | egrep -q '^nothing to commit.*working directory clean'; then echo Untracked files, not pushing && exit 1; fi; \
		echo "==> RSYNC TO PROD"; \
		rsync -Pavz --delete deploy/ julien.danjou.info:/var/www/julien.danjou.info/; \
	else \
		echo "==> RSYNC TO DEV"; \
		rsync -Pavz --delete deploy/ julien.danjou.info:/var/www/dev.julien.danjou.info/; \
	fi

clean:
	rm -rf deploy
	rm -rf content/blog/tags

web: deploy
	cd deploy && python -m SimpleHTTPServer
	# Really I wish I could use that but it's way too buggy. It keeps
	# regenerating the web site for fucking ever
	# hyde serve -p 8080

content/media/images/blog/2012/openstack-swift-storage.png: content/blog/2012/openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

content/media/images/blog/2012/openstack-swift-replication.png: content/blog/2012/openstack-swift-replication.ditaa
	ditaa --overwrite $< $@


content/media/images/talks/%.png: content/talks/%.pdf
	convert $<[0] $@
	pngcrush $@ $@crush
	mv $@crush $@

.PHONY: clean web pub
