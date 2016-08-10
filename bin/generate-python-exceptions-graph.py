#!/usr/bin/env python
try:
    import exceptions           # Python 2
except ImportError:
    import builtins as exceptions # Python 3

print("digraph G {")
for name in dir(exceptions):
    # This is an exception!
    item = getattr(exceptions, name)
    if isinstance(item, type) and BaseException in item.__mro__:
        for parent in item.__bases__:
            print("  " + parent.__name__ + " -> " + item.__name__ + ";")
print("}")
