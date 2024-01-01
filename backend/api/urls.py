from django.urls import path
from .views import RoomListView, RoomDetailView, CreateRoomView, JoinRoomView, UserInRoom, LeaveRoom

urlpatterns = [
    path('rooms', RoomListView.as_view(), name='rooms'),
    path('room', RoomDetailView.as_view(), name='room_detail'),
    path('room/create', CreateRoomView.as_view(), name='room_create'),
    path('room/join', JoinRoomView.as_view(), name='room_join'),
    path('user-in-room', UserInRoom.as_view(), name='user_in_room'),
    path('room/leave', LeaveRoom.as_view(), name='room_leave'),
]
