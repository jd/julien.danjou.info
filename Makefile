deploy: site.yaml clean content/media/images/blog/2012/openstack-swift-storage.png content/media/images/blog/2012/openstack-swift-replication.png
	hyde gen

pub: deploy
	git status | grep -q ^Untracked\ files: && Untracked files, not pushing && exit 1
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

.PHONY: clean web pub
