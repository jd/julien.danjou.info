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
DYNAMIC_DEPLOY+=deploy/media/js/custom.min.js
DYNAMIC_DEPLOY+=deploy/media/js/plugins.min.js

deploy: site.yaml $(DYNAMIC_DEPLOY)
	hyde -x gen -r
	# I wish I could generate files without the .html extension but the
	# TaggerPlugin from Hyde can't do that yet
	cd deploy/blog/tags && find . -name '*.html' | while read tag; do cp "$$tag" "`basename "$$tag" .html`"; done

clean-pub:
	aws s3 rm --recursive --region eu-west-1 s3://julien.danjou.info

pub: deploy
	if [ "$(BRANCH)" = "master" ]; then \
		if ! git status | egrep -q '^nothing to commit.*working directory clean'; then echo Untracked files, not pushing && exit 1; fi; \
		echo "==> RSYNC TO PROD"; \
		aws s3 sync deploy --region eu-west-1 s3://julien.danjou.info --exclude 'blog/*' --exclude 'projects/*'; \
		aws s3 sync deploy/projects --region eu-west-1 s3://julien.danjou.info/projects --content-type text/html; \
		aws s3 sync deploy/blog/tags --region eu-west-1 s3://julien.danjou.info/blog --exclude '*.xml' --content-type text/html --cache-control max-age=3600; \
		aws s3 sync deploy/blog --region eu-west-1 s3://julien.danjou.info/blog --exclude '*.xml' --content-type text/html; \
		aws s3 cp deploy/blog/index.html --region eu-west-1 s3://julien.danjou.info/blog/index.html --cache-control max-age=3600; \
		aws s3 sync deploy/blog --region eu-west-1 s3://julien.danjou.info/blog --exclude '*' --include '*.xml' --cache-control max-age=3600; \
	else \
		echo "==> RSYNC TO DEV"; \
		echo "no dev yet"; \
	fi

clean:
	git clean -xdf deploy content

web: deploy
	cd deploy && PYTHONPATH=.. python -m HTTPServer
	# Really I wish I could use that but it's way too buggy. It keeps
	# regenerating the web site for fucking ever
	# hyde serve -p 8080

deploy/media/images/blog/2012/openstack-swift-storage.png: deploy/blog/2012/openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

deploy/media/images/blog/2012/openstack-swift-replication.png: deploy/blog/2012/openstack-swift-replication.ditaa
	ditaa --overwrite $< $@


deploy/media/images/talks/thumbnails/%.png: deploy/talks/%.pdf
	mkdir -p deploy/media/images/talks/thumbnails
	convert $<[0] $@
	pngcrush -ow $@

deploy/media/js/%.min.js: deploy/media/js/%.js
	uglifyjs $< > $@

pngcrush:
	find deploy -name '*.png' -exec pngcrush -ow {} \;

.PHONY: clean web pub pngcrush clean-pub deploy
