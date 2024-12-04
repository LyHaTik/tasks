from django.contrib import admin

from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'status', 'created_at', 'user',)
    

admin.site.register(Task, TaskAdmin)