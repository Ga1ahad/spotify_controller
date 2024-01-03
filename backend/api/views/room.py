from django.http import JsonResponse
from rest_framework.views import APIView

from ..models import Room
from ..serializers import RoomSerializer, CreateRoomSerializer, ViewRoomSerializer, JoinRoomSerializer, \
    UpdateRoomSerializer
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


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        print(request.data)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)