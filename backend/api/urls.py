from django.urls import path
from .views import RoomListView, RoomDetailView, CreateRoomView, JoinRoomView

urlpatterns = [
    path('rooms', RoomListView.as_view(), name='rooms'),
    path('room', RoomDetailView.as_view(), name='room_detail'),
    path('room/create', CreateRoomView.as_view(), name='room_create'),
    path('room/join', JoinRoomView.as_view(), name='room_join')
]
