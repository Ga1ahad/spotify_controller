from django.urls import path
from .views import RoomListView, RoomDetailView, CreateRoomView

urlpatterns = [
    path('rooms', RoomListView.as_view(), name='rooms'),
    path('room/<int:id>', RoomDetailView.as_view(), name='room_detail'),
    path('room/create', CreateRoomView.as_view(), name='room_create')
]
