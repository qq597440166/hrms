#!/usr/bin/env python
#-*- coding: utf-8 -*-
from django.conf.urls import url, patterns, include
import views

urlpatterns = patterns('',
	url(r'^instances/$', views.renderInstances),
)
