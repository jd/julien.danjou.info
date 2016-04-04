BRANCH=$(shell git branch | grep '^*' | cut -d' ' -f2)

DYNAMIC_DEPLOY=deploy/media/images/blog/2012/openstack-swift-storage.png
DYNAMIC_DEPLOY+=deploy/media/images/blog/2012/openstack-swift-replication.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/CeilometerPlusHeatEqualsAlarming-OpenStackIcehouseSummit.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/ceilometer-to-telemetry.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/ceilometer-gnocchi.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/OpenStack-and-Debian.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/How_awesome_ended_with_Lua_and_not_Guile.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/Ceilometer-presentation-OpenStack-France-meetup-\#2.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/Ceilometer-presentation-XLCloud.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/Ceilometer-presentation-ODS-Havana.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/Ceilometer-presentation-FOSDEM-2013.png
DYNAMIC_DEPLOY+=deploy/media/images/talks/thumbnails/openstack-gnocchi-paris-meetup.png

deploy: site.yaml clean $(DYNAMIC_DEPLOY)
	hyde -x gen

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
	rm -rf deploy/[^media]
	rm -rf content/blog/tags

web: deploy
	cd deploy && python -m SimpleHTTPServer
	# Really I wish I could use that but it's way too buggy. It keeps
	# regenerating the web site for fucking ever
	# hyde serve -p 8080

deploy/media/images/blog/2012/openstack-swift-storage.png: content/blog/2012/openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

deploy/media/images/blog/2012/openstack-swift-replication.png: content/blog/2012/openstack-swift-replication.ditaa
	ditaa --overwrite $< $@


deploy/media/images/talks/thumbnails/%.png: deploy/talks/%.pdf
	mkdir -p deploy/media/images/talks/thumbnails
	convert $<[0] $@
	pngcrush -ow $@

pngcrush:
	find deploy -name '*.png' -exec pngcrush -ow {} \;

.PHONY: clean web pub pngcrush
