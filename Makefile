deploy: site.yaml clean
	hyde gen

pub: deploy
	rsync -Pavz --delete deploy/ julien.danjou.info:/var/www/julien.danjou.info/

clean:
	rm -rf deploy
	rm -f content/blog/tags/*.html

web: deploy
	hyde serve -p 8080

.PHONY: clean web pub
