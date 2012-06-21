BLOG_YEARS=$(wildcard content/blog/20*)
BLOG_INDEX=$(BLOG_YEARS:=/index.html)
BLOG_META= $(BLOG_YEARS:=/meta.yaml)

deploy: site.yaml clean content/media/images/blog/2012/openstack-swift-storage.png content/media/images/blog/2012/openstack-swift-replication.png $(BLOG_INDEX) $(BLOG_META)
	hyde gen

pub: deploy
	rsync -Pavz --delete deploy/ pro.julien.danjou.info:/var/www/pro.julien.danjou.info/

clean:
	rm -rf deploy
	rm -f content/blog/tags/*.html
	rm -f content/blog/20*/index.html
	rm -f content/blog/20*/meta.yaml

web: deploy
	hyde serve -p 8080

content/media/images/blog/2012/openstack-swift-storage.png: content/blog/2012/openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

content/media/images/blog/2012/openstack-swift-replication.png: content/blog/2012/openstack-swift-replication.ditaa
	ditaa --overwrite $< $@

content/blog/%/index.html:
	echo '---' > $@
	echo "title: jd:/dev/blog in $(patsubst content/blog/%/index.html,%,$@)" >> $@
	echo '---' >> $@
	echo '{% from "macros.j2" import render_blog_listing with context %}' >> $@
	echo '{{ render_blog_listing(resource.node.walk_resources_sorted_by_time()) }}' >> $@

content/blog/%/meta.yaml:
	echo "title: $(patsubst content/blog/%/meta.yaml,%,$@)" > $@

.PHONY: clean web pub
