#!/usr/bin/env python
import os
import sys

apache_configuration = os.path.dirname(__file__)
project = os.path.dirname(apache_configuration)
workspace = os.path.dirname(project)
sys.path.append(workspace)
sys.path.append("C:\Users\Nicolas-PC\pyproj\HRMS")
sys.path.append("C:\Users\Nicolas-PC\pyproj\HRMS\HRMS")

os.environ['DJANGO_SETTINGS_MODULE'] = 'HRMS.settings'
os.environ['PYTHON_EGG_CACHE'] = '/tmp'

# import django
# django.setup()
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler() 
