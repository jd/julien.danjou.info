deploy: site.yaml clean content/media/css/pygments.css content/media/images/blog/2012/openstack-swift-storage.png content/media/images/blog/2012/openstack-swift-replication.png
	hyde gen

pub: deploy
	rsync -Pavz --delete deploy/ julien.danjou.info:/var/www/julien.danjou.info/

clean:
	rm -rf deploy
	rm -f content/blog/tags/*.html

web: deploy
	hyde serve -p 8080

content/media/images/blog/2012/openstack-swift-storage.png: content/blog/2012/openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

content/media/images/blog/2012/openstack-swift-replication.png: content/blog/2012/openstack-swift-replication.ditaa
	ditaa --overwrite $< $@

content/media/css/pygments.css: Makefile
	pygmentize -f html -S tango -a .highlight > $@

.PHONY: clean web pub
