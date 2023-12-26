from rest_framework.generics import GenericAPIView
from ..models import Room
from ..serializers import RoomSerializer, CreateRoomSerializer
from rest_framework import mixins, generics


class RoomListView(generics.ListAPIView):

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class CreateRoomView(generics.CreateAPIView):

    queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer

    def perform_create(self, serializer):
        print(self.create)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        host = self.request.session.session_key
        serializer.save(host=host)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class RoomDetailView(GenericAPIView,
                     mixins.UpdateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin):

    queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)