from django.db import models, IntegrityError, transaction
from django.utils.crypto import get_random_string


def generate_random_id(length):
    return get_random_string(length, allowed_chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')


class Room(models.Model):
    code = models.CharField(max_length=8, default="", unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self._state.adding is True:
            counter = 0
            while True:
                counter += 1
                if counter > 1000:
                    raise RuntimeError('Cannot set code.')
                try:
                    self.code = generate_random_id(8)
                    with transaction.atomic():
                        super().save(*args, **kwargs)
                    break
                except IntegrityError as e:
                    # 23505 is exact error if self.code will be same as another code
                    if e.__cause__.diag.sqlstate == '23505':
                        continue
                    else:
                        raise e
        else:
            super().save(*args, **kwargs)
