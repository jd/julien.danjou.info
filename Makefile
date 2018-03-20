openstack-swift-storage.png: openstack-swift-storage.ditaa
	ditaa --overwrite $< $@

openstack-swift-replication.png: openstack-swift-replication.ditaa
	ditaa --overwrite $< $@

python2-exceptions-graph.png: bin/generate-python-exceptions-graph.py
	python2 bin/generate-python-exceptions-graph.py | dot -T png > $@
	pngcrush $@ $@.crushed
	mv $@.crushed $@

python3-exceptions-graph.png: bin/generate-python-exceptions-graph.py
	python3 bin/generate-python-exceptions-graph.py | dot -T png > $@
	pngcrush $@ $@.crushed
	mv $@.crushed $@
