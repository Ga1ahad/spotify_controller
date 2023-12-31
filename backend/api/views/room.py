from django.http import JsonResponse
from rest_framework.views import APIView

from ..models import Room
from ..serializers import RoomSerializer, CreateRoomSerializer, ViewRoomSerializer, JoinRoomSerializer
from rest_framework import mixins, generics, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response


class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class CreateRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer

    def perform_create(self, serializer):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        host = self.request.session.session_key
        serializer.save(host=host)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class RoomDetailView(GenericAPIView, mixins.RetrieveModelMixin):
    queryset = Room.objects.all()
    serializer_class = ViewRoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            try:
                room = Room.objects.get(code=code)
            except Room.DoesNotExist:
                return Response({'message': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
            data = RoomSerializer(room).data
            data['is_host'] = self.request.session.session_key == room.host
            return Response(data, status=status.HTTP_200_OK)
        return Response({'message': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoomView(GenericAPIView, mixins.RetrieveModelMixin):
    serializer_class = JoinRoomSerializer
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code is not None:
            try:
                Room.objects.get(code=code)
            except Room.DoesNotExist:
                return Response({'message': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
            self.request.session['room_code'] = code
            return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid post data, did not find a code key'},
                        status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
